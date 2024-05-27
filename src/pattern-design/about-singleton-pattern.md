---
title: 浅谈单例模式
date: 2023-02-10
tag: 
  - 设计模式
---
::: tip 拉个Star
- 如果<a href='https://github.com/kkwalking/person-database' target='blank'>本知识库</a>的内容帮助到你，还请点个免费的Star，感谢。传送门：<a href='https://github.com/kkwalking/person-database' target='blank'>GitHub</a>
:::
# 浅谈单例模式

#### 饿汉模式

```java
public class Singleton {
    private static Singleton instance = new Singleton();
    private Singleton() {}
    public static Singleton newInstance() {
        return instance;
    }
}
```

缺点：在需要初始化许多对象的时候会导致系统启动较慢，比如在有许多个单例对象的容器中，启动该容器的初始过程会比较长。

#### 懒加载模式

```java
public class Singleton {
    private static Singleton instance = null;
    
    private Singleton(){}
    
    public static synchronized Singleton getInstance() {
        if(instance == null) {
            instance = new Singleton();
        }
        return instance;
    }
}
```

缺点：同步方法锁住了对象，降低了系统的处理速度。

#### 错误的双重锁检查

```java
public class Singleton {
    private static Singleton instance = null;
    private Singleton(){}
    public static Singleton getInstance() {
        if(instance == null) {
            synchronized(Singleton.class) {
                if(instance == null) {
                    instance = new Singleton();
                }
            }
        }
        return instance;
    }
}
```

这样的写法是有问题的。在JVM中， instance = new Singleton(); 语句并不是一个原子操作，分为创建对象和引用赋值两步。其中，创建对象需要为对象分配空间，再进行初始化。以上三步，分配内存永远是第一步，但是后面两步则可能被重排序。

JVM并不保证初始化先于引用赋值的顺序，因此很可能是先创建了对象，即在Singleton实例分配了内存空间，但是还未进行初始化，然后赋值给了`instance`，这是实例虽然分配到了空间，但是其并未完成初始化，而`instance`引用却不为空，这时另一个线程抢占执行，执行了`getInstance（）`方法，便会发现`instance`不为`null`，从而直接返回了`instance`，导致系统出错。

#### 正确的双重锁检查

```java
public class Singleton {
    private static volatile Singleton instance = null;
    private Singleton(){}
    public static Singleton getInstance() {
        if(instance == null) {
            synchronized(Singleton.class) {
                if(instance == null) {
                    instance = new Singleton();
                }
            }
        }
        return instance;
    }
}
```

利用volatile的内存可见性可以使得`instance`不会被线程缓存，所有的线程读写该对象都需要对主内存进行操作。

volatile还可以防止指令重排序，从而使得上述的双重锁检查代码正确执行。这里的防止指令重排序是指，volatile修饰的`instance`对象，在执行代码 `instance = new Singleton()`时不会再被JVM进行指令重排序，会按照 `内存分配 -> 初始化 -> 引用赋值` 的顺序执行

#### 使用静态内部类

```java
public class Singleton {
    private Singleton() {}
    private static class SingletonFactory {
        private static Singleton instance = new Singleton();
    }
    public static Singleton getInstance() {
        return SingletonFactory.instance;
    }
    //序列化方法  可忽略
    public Object readResolve() {
        return getInstance();
    }
}
```

这样的写法利用了JVM的类加载机制，JVM在加载类的过程中确保了线程互斥，是线程安全的。外部类被加载时，不会立即加载内部类，从而`instance`不会立即被实例化。当`getInstance()` 第一次被调用时，内部类第一次被引用，从而加载了内部类，并完成了`instance`的实例化，而JVM的类加载机制确保了实例化instance的过程中的线程安全性。

缺点：使用静态内部类的方式，则存在传参的问题，外部无法传递参数给内部类

#### 使用枚举

```java
public enum Singleton {
    INSTANCE;
    ...  //其他方法代码
}
```

枚举类型的实例创建出来天然就是单例的，并且是线程安全的。