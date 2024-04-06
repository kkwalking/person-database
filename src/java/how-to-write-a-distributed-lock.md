---
title: 如何实现一个分布式锁
date: 2024-04-05
tag:
  - Java
  - 分布式
---

# 如何实现一个分布式锁

关于分布式锁的基本知识，可以参考我先前的一篇文章：[分布式锁理论介绍](./distributed-lock-introduction.md)。本篇内容主要介绍如何使用 Java 语言实现一个分布式锁。

我们来写一个注解式分布式锁，主要是通过注解+AOP 环绕通知来实现。

## 1. 锁注解

我们首先写一个锁的注解

```java
package com.kelton.lock.annotation;

import java.lang.annotation.*;

/**
 * 分布式锁注解
 * @author kelton
 */
@Retention(RetentionPolicy.RUNTIME)
@Target({ElementType.METHOD})
@Documented
public @interface RedisLock {

    long DEFAULT_TIMEOUT_FOR_LOCK = 5L;
    long DEFAULT_EXPIRE_TIME = 60L;

    String key() default "your-biz-key";

    long expiredTime() default DEFAULT_EXPIRE_TIME;

    long timeoutForLock() default DEFAULT_TIMEOUT_FOR_LOCK;

}
```

expiredTime 是设置锁的过期时间，timeoutForLock 是设置等待锁的超时时间。如果没有等待获得锁的超时时间这个功能，那么其他线程在获取锁失败时只能直接失败，无法进行排队等待。

我们如何使用这个注解呢，很容易，在需要加锁的业务方法上直接用就行.如下，我们有一个库存服务类，它有一个扣减库存方法，该方法将数据库中的一个库存商品的数量减一。在并发场景下，如果我们没有对其进行资源控制，必然会发生库存扣减不一致现象。

```java
public class StockServiceImpl {
    @RedisLock(key = "stock-lock", expiredTime = 10L, timeoutForLock = 5L)
    public void deduct(Long stockId) {
        Stock stock = this.getById(1L);
        Integer count = stock.getCount();
        stock.setCount(count - 1);
        this.updateById(stock);
    }
}
```

## 2. 在 AOP 切面中进行加锁处理

我们需要使用 AOP 来处理什么？自然是处理使用`@RedisLock`的方法，因此我们写一个切点表达式，它匹配所有标有 @RedisLock 注解的方法。

接着，我们将此切点表达式与 @Around 注解结合使用，以创建环绕通知，在目标方法执行前后执行我们的加锁解锁逻辑。
因此，基本的逻辑我们就理清了，代码大致长下面这个样子:

```java
public class RedisLockAspect {

    private final RedisTemplate<String, Object> redisTemplate;

    // 锁的redis key前缀
    private static final String DEFAULT_KEY_PREFIX = "lock:";

    // 匹配所有标有 @RedisLock 注解的方法
    @Pointcut("@annotation(com.kelton.lock.annotation.RedisLock)")
    public void lockAnno() {
    }


    @Around("lockAnno()")
    public void invoke(ProceedingJoinPoint joinPoint) throws Exception {
        // 获取拦截方法上的RedisLock注解
        RedisLock annotation = getLockAnnotationOnMethod(joinPoint);
        // 获取锁key
        String key = getKey(annotation);
        // 锁过期时间
        long expireTime = annotation.expiredTime();
        // 获取锁的等待时间
        long timeoutForLock = annotation.timeoutForLock();
        // 在这里加锁
        someCodeForLock...
        // 执行业务
        joinPoint.proceed();
        // 在这里解锁
        someCodeForUnLock...
    }

```

我们在加锁的时候，需要用上 timeoutForLock 这个属性，我们通过自旋加线程休眠的方式，来达到在一段时间内等待获取锁的目的。如果自旋时间结束后，还没获取锁，则抛出异常，这里可以根据自己情况而定。自旋加锁代码如下：

```java
        boolean acquired = false;
        String uuid = UUID.randomUUID().toString();
        while(System.currentTimeMillis() < endTime) {
            Boolean absent = redisTemplate.opsForValue()
                    .setIfAbsent(key, uuid, expireTime, TimeUnit.SECONDS);

            if (Boolean.TRUE.equals(absent)) {
                acquired = true;
                break;
            } else {
                // 获取不到锁，尝试休眠100毫秒后重试
                Thread.sleep(100);
            }
        }
        // 超时未获取到锁， 抛出异常，可根据自己业务而定
        if (!acquired) {
            throw new RuntimeException("获取锁异常");
        }
```

我们发现上面加锁的时候设置了一个 uuid 作为 value 值，这是为了在锁释放的时候，不误删其他线程上的锁，具体可以参考我先前的一篇文章：[分布式锁理论介绍](./distributed-lock-introduction.md)。随后，我们就可以执行被 AOP 切中的方法，执行结束释放锁。代码如下：

```java
        try {
            // 执行业务
            joinPoint.proceed();
        } catch (Throwable e) {
            log.error("业务执行出错！");
        } finally {
            // 解锁时进行校验，只删除自己线程加的锁
            String value = (String) redisTemplate.opsForValue().get(key);
            if (uuid.equals(value)) {
                redisTemplate.delete(key);
            } else {
                log.warn("锁已过期！");
            }
        }
```

到这里，我们就以注解+AOP 的方式实现了分布式锁的功能。当然，以上只实现了分布式锁的简单功能，还缺少了分布式锁的 key 自动续约防止锁过期功能，以及锁重入功能。

目前，`RedisLockAspect`的完整代码如下：

```java
@Component
@Aspect
@Slf4j
@AllArgsConstructor
public class RedisLockAspect {

    // 匹配所有标有 @RedisLock 注解的方法
    @Pointcut("@annotation(com.kelton.lock.annotation.RedisLock)")
    public void lockAnno() {
    }


    @Around("lockAnno()")
    public void invoke(ProceedingJoinPoint joinPoint) throws Exception {
        // 获取拦截方法上的RedisLock注解
        RedisLock annotation = getLockAnnotationOnMethod(joinPoint);

        String key = getKey(annotation);
        // 锁过期时间
        long expireTime = annotation.expiredTime();
        // 获取锁的等待时间
        long timeoutForLock = annotation.timeoutForLock();
        // 自旋获取锁
        long endTime = System.currentTimeMillis() + timeoutForLock * 1000;
        boolean acquired = false;
        String uuid = UUID.randomUUID().toString();
        while(System.currentTimeMillis() < endTime) {
            Boolean absent = redisTemplate.opsForValue()
                    .setIfAbsent(key, uuid, expireTime, TimeUnit.SECONDS);

            if (Boolean.TRUE.equals(absent)) {
                acquired = true;
                break;
            } else {
                // 获取不到锁，尝试休眠100毫秒后重试
                Thread.sleep(100);
            }
        }
        // 超时未获取到锁， 抛出异常，可根据自己业务而定
        if (!acquired) {
            throw new RuntimeException("获取锁异常");
        }
        try {
            // 执行业务
            joinPoint.proceed();
        } catch (Throwable e) {
            log.error("业务执行出错！");
        } finally {
            // 解锁时进行校验，只删除自己线程加的锁
            String value = (String) redisTemplate.opsForValue().get(key);
            if (uuid.equals(value)) {
                redisTemplate.delete(key);
            } else {
                log.warn("锁已过期！");
            }
        }
    }

    private String getKey(RedisLock redisLock) {
        if (Objects.isNull(redisLock)) {
            return DEFAULT_KEY_PREFIX + "default";
        }
        return DEFAULT_KEY_PREFIX + redisLock.key();
    }

    private RedisLock getLockAnnotationOnMethod(ProceedingJoinPoint joinPoint) {
        MethodSignature signature = (MethodSignature) joinPoint.getSignature();
        Method method = signature.getMethod();
        return method.getAnnotation(RedisLock.class);
    }

}
```

## 3. key 自动续约防止锁过期

我们接着完善该分布式锁，为其添加 key 自动续约防止锁过期的功能。我们的思路与*Redission*的*watch dog*类似，开启一个后台线程，来定时检查需要续约的锁。我们如何判断一个锁是否需要续约呢，我们可以简单定义一个续约分界线，比如在锁过期时间的三分之二的时间点及之后，对锁进行续约。

### 3.1 定义一个续约任务

我们来定义一个锁续约任务，那我们需要什么信息呢？

我们至少需要锁的 key，锁要设置的过期时间。这是两个最基本的信息。

要判断在锁过期时间的三分之二的时间点及之后进行续约，那么我们还需要记录锁上次续约的时间点。

此外，我们还可以为锁续约任务添加最大续约次数限制，这可以避免某些执行时间特别久的任务不断占用锁。所以我们还需要记录当前锁续约次数和最大续约次数。

对超过最大续约次数的锁的线程，我们直接将其停止，因此我们也记录一下该锁的线程。

结合上面的分析，我们定义的锁续约任务类如下：

```java
public class LockRenewTask {

    /**
     * key
     */
    private final String key;
    /**
     * 过期时间。单位：秒
     */
    private final long expiredTime;
    /**
     * 锁的最大续约次数
     */
    private final int maxRenewCount;
    /**
     * 锁的当前续约次数
     */
    private int currentRenewCount;
    /**
     * 最新更新时间
     */
    private LocalDateTime latestRenewTime;
    /**
     * 业务线程
     */
    private final Thread thread;

    public LockRenewTask(String key, long expiredTime, int maxRenewCount, Thread thread) {
        this.key = key;
        this.expiredTime = expiredTime;
        this.maxRenewCount = maxRenewCount;
        this.thread = thread;
        this.latestRenewTime = LocalDateTime.now();
    }
    /**
     * 是否到达续约时间
     * @return
     */
    public boolean isTimeToRenew() {
        LocalDateTime now = LocalDateTime.now();
        Duration duration = Duration.between(latestRenewTime, now);

        return duration.toSeconds() >= ((double)(this.expiredTime / 3) * 2);
    }
    /**
     * 是否达到最大续约次数
     * @return
     */
    public boolean exceedMaxRenewCount() {
        return this.currentRenewCount >= this.maxRenewCount;
    }
    public synchronized void renew() {
        this.currentRenewCount++;
        this.latestRenewTime = LocalDateTime.now();
    }
    // 取消业务方法
    public void cancel() {
        thread.interrupt();
    }
    public String getKey() {
        return key;
    }
    public long getExpiredTime() {
        return expiredTime;
    }
}
```

我们添加了一些关于锁续约的方法：

- isTimeToRenew(): 判断是否可以对锁进行续约
- exceedMaxRenewCount(): 判断是否达到最大续约次数
- renew(): 来标记一次续约操作
- cancel(): 取消业务方法

### 3.2 定义一个锁续约任务处理器

接着，我们定义一个定时执行该续约任务的 handler。该 handler 也比较简答，核心逻辑是持有一个类型为 `List<LockRenewTask>`的 taskList 来添加续约任务，且使用一个 ScheduledExecutorService 来定时遍历该 taskList 来执行续约任务。该 handler 再对外暴露一个 addRenewTask 方法，方便外部调用来添加续约任务到 taskList 中。

```java
@Slf4j
@Component
public class LockRenewHandler {

    @Autowired
    private RedisTemplate<String, Object> redisTemplate;

    /**
     * 保障对 taskList的添加删除操作是线程安全的
     */
    private final ReentrantLock taskListLock = new ReentrantLock();

    private final List<LockRenewTask> taskList = new ArrayList<>();

    private final ScheduledExecutorService taskExecutorService;

    {
        taskExecutorService = Executors.newScheduledThreadPool(Runtime.getRuntime().availableProcessors());
        taskExecutorService.scheduleAtFixedRate(() -> {
            try {
                executeRenewTask();
            } catch (Exception e) {
                //错误处理
            }
        }, 1, 2, TimeUnit.SECONDS);

    }
    /**
     * 添加续约任务
     */
    public void addRenewTask(LockRenewTask task) {
        taskListLock.lock();
        try {
            taskList.add(task);
        } finally {
            taskListLock.unlock();
        }
    }
    /**
     * 执行续约任务
     */
    private void executeRenewTask() {
        log.info("开始执行续约任务");
        if (CollectionUtils.isEmpty(taskList)) {
            return;
        }
        // 需要删除的任务，暂存这个集合中  取消
        List<LockRenewTask> cancelTask = new ArrayList<>();
        // 获取任务副本
        List<LockRenewTask> copyTaskList = new ArrayList<>(taskList);
        for (LockRenewTask task : copyTaskList) {
            try {
                // 判断 Redis 中是否存在 key
                if (!redisTemplate.hasKey(task.getKey())) {
                    cancelTask.add(task);
                    continue;
                }
                // 大于等于最大续约次数
                if (task.exceedMaxRenewCount()) {
                    // 停止续约任务
                    task.cancel();
                    cancelTask.add(task);
                    continue;
                }
                // 到达续约时间
                if (task.isTimeToRenew()) {
                    log.info("续约任务：{}", task.getKey());
                    redisTemplate.expire(task.getKey(), task.getExpiredTime(), TimeUnit.SECONDS);
                    task.renew();
                }
            } catch (Exception e) {
                //错误处理
                log.error("处理任务出错：{}", task);
            }
        }
        // 加锁，删除 taskList 中需要移除的任务
        taskListLock.lock();
        try {
            taskList.removeAll(cancelTask);
            // 清理cancelTask,避免堆积，产生内存泄露
            cancelTask.clear();
        } finally {
            taskListLock.unlock();
        }
    }
}
```

总结一下 `LockRenewHandler`的主要作用：它负责管理和执行续约任务，以延长 Redis 中键的过期时间。

- **添加续约任务**：`addRenewTask()` 方法允许添加新的续约任务到内部列表 `taskList` 中。
- **执行续约任务**：`executeRenewTask()` 方法定期执行续约任务。它检查每个任务的状态，并根据需要续约 Redis 中的键。
- **移除完成的任务**：维护一个 `cancelTask` 列表，用于存储需要从 `taskList` 中移除的任务。在 `executeRenewTask()` 方法中，它会将完成的任务添加到 `cancelTask` 列表中，并在之后将其从 `taskList` 中移除。

**大概的工作流程如下**：

1. 续约任务被添加到 `taskList` 中。
2. `executeRenewTask()` 方法定期执行，它检查每个任务的状态：
   - 如果 Redis 中不再存在该键，则取消任务。
   - 如果任务的续约次数达到上限，则取消任务。
   - 如果是时候续约了，则续约 Redis 中的键并更新任务的续约次数，记录续约时间点。
3. 完成的任务被添加到 `cancelTask` 列表中。
4. `executeRenewTask()` 方法获取 `taskList` 的副本，并从副本中移除 `cancelTask` 中的任务，并且在完成移除任务操作后清空`cancelTask`。
5. 更新后的 `taskList` 被保存回类中。

两个需要注意的点

- 我们还遍历`taskList`时是拷贝了一份副本进行遍历，因为`taskList`是可变的，这样可以避免在遍历的时候产生并发修改问题。
- `cancelTask`需要清理，避免产生内存泄漏。

通过这种方式，`LockRenewHandler` 可以确保 Redis 中的键在需要时得到续约，并自动移除完成或失败的任务。

### 3.3 添加锁续约任务

在上面 3.1 节和 3.2 节我们定义好了锁续约任务和处理锁续约任务的核心代码，接下来我们需要在第 2 节加锁解锁的 AOP 处理逻辑上进行一点小小的修改，主要就是在执行加锁之后，执行业务代码之前，添加上锁续约任务。修改位置如下：

```java
    public void invoke(ProceedingJoinPoint joinPoint) throws Exception {
        ... // 省略代码
        try {
            // 添加锁续约任务
            LockRenewTask task = new LockRenewTask(key, annotation.expiredTime(), annotation.maxRenew(), Thread.currentThread());
            lockRenewHandler.addRenewTask(task);
            log.info("添加续约任务, key:{}", key);
            // 执行业务
            joinPoint.proceed();
        } catch (Throwable e) {
            log.error("业务执行出错！");
        } finally {
            // 解锁时进行校验，只删除自己线程加的锁
            String value = (String) redisTemplate.opsForValue().get(key);
            if (uuid.equals(value)) {
                redisTemplate.delete(key);
            } else {
                log.warn("锁已过期！");
            }
        }
        ... // 省略代码
    }
```

到这里，我们的分布式锁已经相当完善了，把锁自动续约的功能也加上了。当然，还没有实现锁的可重入性。如果你有好的点子，欢迎到仓库提 issue 反馈。

::: tip 拉个 Star

- 看到这里，如果<a href='https://github.com/shzyjbr/person-database' target='blank'>本篇文章</a>的内容帮助到你，还请点个免费的 Star，感谢。传送门：<a href='https://github.com/shzyjbr/person-database' target='blank'>GitHub</a>
  :::
