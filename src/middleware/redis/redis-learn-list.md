---
title: Redis学习笔记之链表
category: 中间件
date: 2023-10-14
tag:
  - Redis
---
::: tip 拉个Star
- 如果<a href='https://github.com/shzyjbr/person-database' target='blank'>本知识库</a>的内容帮助到你，还请点个免费的Star，感谢。传送门：<a href='https://github.com/shzyjbr/person-database' target='blank'>GitHub</a>
:::

> 本系列是个人的Redis学习笔记，参考的书籍有《Redis设计与实现》、《Redis深度历险--核心原理与应用实践》，Redis源码版本是黄健宏老师注释的[Redis-3.0-annotated](https://github.com/huangz1990/redis-3.0-annotated)版本

## 一、Redis中的链表应用场景

链表是一种应用非常广泛的数据结构，在很多语言中都有相应的实现和使用，比如Java中的LinkedList。C语言中并没有内置的链表实现，因此Redis实现了自己的链表结构，并将它应用在许多场景，比如我们在Redis中使用的list，其底层就是用链表实现的。

Redis中的list是由字符串值组成的双向链表，其基本用法如下：

```
127.0.0.1:6379> lpush fruits apple banana orange
(integer) 3
127.0.0.1:6379>
```

Redis中的list支持从两边对链表进行操作，其主要使用的命令有LPUSH，RPUSH，LPOP，RPOP。

利用这些命令，可以把list作为队列或者栈来使用。

比如组合使用LPUSH和RPOP，即左进右出，那么可以模拟成**队列**。当然也可以反过来，RPUSH和LPOP，即右进左出。比如像下面这样使用：

```
127.0.0.1:6379> lpush fruits apple banana orange
(integer) 3
127.0.0.1:6379> rpop fruits
"apple"
```

## 二、Redis的链表实现

Redis中的链表实现与常见的链表差不多，基本结构有listNode和list。listNode是链表节点结构，list是链表结构。listNode的基本结构如下：

```c
typedef struct listNode {

    // 前置节点
    struct listNode *prev;
    // 后置节点
    struct listNode *next;
    // 节点的值
    void *value;

} listNode;
```

next指针作为前向指针，可以沿着表头到表尾的方向进行遍历；prev指针作为后向指针，可以沿着表尾到表头的方向进行遍历；value是一个值指针。

使用listNode组成的双向链表结构如下所示:

![](http://zzk31.320.io/img/20230521171907.png)

list的结构如下所示：

```C
typedef struct list {

    // 头节点
    listNode *head;
    // 尾节点
    listNode *tail;
    // 链表长度，即链表所包含的节点数
    unsigned long len;
    // 节点值复制函数
    void *(*dup)(void *ptr);
    // 节点值释放函数
    void (*free)(void *ptr);
    // 节点值对比函数
    int (*match)(void *ptr, void *key);

} list;
```

通过list 结构可以很方便地取到链表的头节点、尾节点以及链表长度。dup 、 free 和 match 属性是用于实现多态链表所需的类型特定函数，具体地，dup 函数用于复制链表节点所保存的值；free 函数用于释放链表节点所保存的值；match 函数则用于对比链表节点所保存的值和另一个输入值是否相等。使用list之后的链表结构如下：

![](http://zzk31.320.io/img/20230521172758.png)

Redis 的链表实现的特性可以总结如下：

- 双端： listNode有 prev 和 next 指针， 可以以$O(1)$的时间复杂度获取某个节点的前置节点和后置节点
- 无环： 表头节点的 prev 指针和表尾节点的 next 指针都为 NULL ， 对链表的访问以 NULL 为终点
- 带表头指针和表尾指针： 通过 list的 head 指针和 tail 指针可以很容易获取表头结点和表尾节点
- $O(1)$时间复杂度获取链表长度：list 的len 属性来记录了链表节点
- 多态： listNode使用 void* 指针来保存节点值， 并且可以通过 list 的 dup 、free 、match 三个属性为节点值设置类型特定函数， 所以链表可以用于保存各种不同类型的值并且应用不同的复制函数、内存释放函数和匹配函数。

## 三、list中一些函数的源码实现

1. 将元素插入到list表头，如下图所示，向表头插入val0之后list的变化，红色的相关指针是发生变化的指针。

![](http://zzk31.320.io/img/20230521230420.png)

```C
/*
 * 使用给定的value值构造新的节点并添加到链表的表头
 * 如果为新节点分配内存出错，那么不执行任何动作，仅返回 NULL
 * 如果执行成功，返回传入的链表指针
 * T = O(1)
 */
list *listAddNodeHead(list *list, void *value)
{
    listNode *node;

    // 为节点分配内存
    if ((node = zmalloc(sizeof(*node))) == NULL)
        return NULL;

    // 保存值指针
    node->value = value;

    // 添加节点到空链表
    // 当链表为空时，新插入的节点既是头结点也是尾结点
    if (list->len == 0) {
        list->head = list->tail = node;
        // 注意头结点的前驱指针应该为空，尾结点的后继指针应该为空
        node->prev = node->next = NULL;
    // 添加节点到非空链表
    // 当链表非空时,采用头插法将新插入节点链接到链表头部,并更新list的head指针
    } else {
        node->prev = NULL; //注意头结点的前驱指针应该为空
        node->next = list->head;
        list->head->prev = node;
        list->head = node;
    }

    // 更新链表节点数
    list->len++;

    return list;
}
```

2. 将元素插入到list表尾，如下图所示，想表尾插入val5之后list的变化，红色的相关指针是发生变化的指针。

![](http://zzk31.320.io/img/20230521230452.png)

```C
/*
 * 使用给定的value值构造新的节点并添加到链表的表尾
 * 如果为新节点分配内存出错，那么不执行任何动作，仅返回 NULL
 * 如果执行成功，返回传入的链表指针
 * T = O(1)
 */
list *listAddNodeTail(list *list, void *value)
{
    listNode *node;

    // 为新节点分配内存
    if ((node = zmalloc(sizeof(*node))) == NULL)
        return NULL;

    // 保存值指针
    node->value = value;

    // 目标链表为空
    // 当链表为空时，新插入的节点既是头结点也是尾结点
    if (list->len == 0) {
        list->head = list->tail = node;
        // 注意头结点的前驱指针应该为空，尾结点的后继指针应该为空
        node->prev = node->next = NULL;
    // 目标链表非空
    } else {
        node->prev = list->tail;
        node->next = NULL;
        list->tail->next = node;
        list->tail = node;
    }

    // 更新链表节点数
    list->len++;

    return list;
}
```

3. 创建list，如下图所示，其中NULL指针没有画出：

![](http://zzk31.320.io/img/20230521230555.png)

```C
/*
 * 创建一个新的链表
 * 创建成功返回链表，失败返回 NULL 。
 * T = O(1)
 */
list *listCreate(void)
{
    struct list *list;

    // 分配内存
    if ((list = zmalloc(sizeof(*list))) == NULL)
        return NULL;

    // 初始化各项属性
    list->head = list->tail = NULL;
    list->len = 0;
    list->dup = NULL;
    list->free = NULL;
    list->match = NULL;

    return list;
}
```

