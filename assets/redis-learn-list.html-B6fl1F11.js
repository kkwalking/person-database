import{_ as s}from"./plugin-vue_export-helper-DlAUqK2U.js";import{r as l,o as a,c as t,a as e,e as i,b as d,d as r}from"./app-CInGSLxZ.js";const v={},c=e("div",{class:"hint-container tip"},[e("p",{class:"hint-container-title"},"拉个Star"),e("ul",null,[e("li",null,[i("如果"),e("a",{href:"https://github.com/shzyjbr/person-database",target:"blank"},"本知识库"),i("的内容帮助到你，还请点个免费的Star，感谢。传送门："),e("a",{href:"https://github.com/shzyjbr/person-database",target:"blank"},"GitHub")])])],-1),o={href:"https://github.com/huangz1990/redis-3.0-annotated",target:"_blank",rel:"noopener noreferrer"},u=r(`<h2 id="一、redis中的链表应用场景" tabindex="-1"><a class="header-anchor" href="#一、redis中的链表应用场景"><span>一、Redis中的链表应用场景</span></a></h2><p>链表是一种应用非常广泛的数据结构，在很多语言中都有相应的实现和使用，比如Java中的LinkedList。C语言中并没有内置的链表实现，因此Redis实现了自己的链表结构，并将它应用在许多场景，比如我们在Redis中使用的list，其底层就是用链表实现的。</p><p>Redis中的list是由字符串值组成的双向链表，其基本用法如下：</p><div class="language-text line-numbers-mode" data-ext="text" data-title="text"><pre class="language-text"><code>127.0.0.1:6379&gt; lpush fruits apple banana orange
(integer) 3
127.0.0.1:6379&gt;
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>Redis中的list支持从两边对链表进行操作，其主要使用的命令有LPUSH，RPUSH，LPOP，RPOP。</p><p>利用这些命令，可以把list作为队列或者栈来使用。</p><p>比如组合使用LPUSH和RPOP，即左进右出，那么可以模拟成<strong>队列</strong>。当然也可以反过来，RPUSH和LPOP，即右进左出。比如像下面这样使用：</p><div class="language-text line-numbers-mode" data-ext="text" data-title="text"><pre class="language-text"><code>127.0.0.1:6379&gt; lpush fruits apple banana orange
(integer) 3
127.0.0.1:6379&gt; rpop fruits
&quot;apple&quot;
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="二、redis的链表实现" tabindex="-1"><a class="header-anchor" href="#二、redis的链表实现"><span>二、Redis的链表实现</span></a></h2><p>Redis中的链表实现与常见的链表差不多，基本结构有listNode和list。listNode是链表节点结构，list是链表结构。listNode的基本结构如下：</p><div class="language-c line-numbers-mode" data-ext="c" data-title="c"><pre class="language-c"><code><span class="token keyword">typedef</span> <span class="token keyword">struct</span> <span class="token class-name">listNode</span> <span class="token punctuation">{</span>

    <span class="token comment">// 前置节点</span>
    <span class="token keyword">struct</span> <span class="token class-name">listNode</span> <span class="token operator">*</span>prev<span class="token punctuation">;</span>
    <span class="token comment">// 后置节点</span>
    <span class="token keyword">struct</span> <span class="token class-name">listNode</span> <span class="token operator">*</span>next<span class="token punctuation">;</span>
    <span class="token comment">// 节点的值</span>
    <span class="token keyword">void</span> <span class="token operator">*</span>value<span class="token punctuation">;</span>

<span class="token punctuation">}</span> listNode<span class="token punctuation">;</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>next指针作为前向指针，可以沿着表头到表尾的方向进行遍历；prev指针作为后向指针，可以沿着表尾到表头的方向进行遍历；value是一个值指针。</p><p>使用listNode组成的双向链表结构如下所示:</p><figure><img src="http://zzk31.320.io/img/20230521171907.png" alt="" tabindex="0" loading="lazy"><figcaption></figcaption></figure><p>list的结构如下所示：</p><div class="language-C line-numbers-mode" data-ext="C" data-title="C"><pre class="language-C"><code>typedef struct list {

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
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>通过list 结构可以很方便地取到链表的头节点、尾节点以及链表长度。dup 、 free 和 match 属性是用于实现多态链表所需的类型特定函数，具体地，dup 函数用于复制链表节点所保存的值；free 函数用于释放链表节点所保存的值；match 函数则用于对比链表节点所保存的值和另一个输入值是否相等。使用list之后的链表结构如下：</p><figure><img src="http://zzk31.320.io/img/20230521172758.png" alt="" tabindex="0" loading="lazy"><figcaption></figcaption></figure><p>Redis 的链表实现的特性可以总结如下：</p><ul><li>双端： listNode有 prev 和 next 指针， 可以以$O(1)$的时间复杂度获取某个节点的前置节点和后置节点</li><li>无环： 表头节点的 prev 指针和表尾节点的 next 指针都为 NULL ， 对链表的访问以 NULL 为终点</li><li>带表头指针和表尾指针： 通过 list的 head 指针和 tail 指针可以很容易获取表头结点和表尾节点</li><li>$O(1)$时间复杂度获取链表长度：list 的len 属性来记录了链表节点</li><li>多态： listNode使用 void* 指针来保存节点值， 并且可以通过 list 的 dup 、free 、match 三个属性为节点值设置类型特定函数， 所以链表可以用于保存各种不同类型的值并且应用不同的复制函数、内存释放函数和匹配函数。</li></ul><h2 id="三、list中一些函数的源码实现" tabindex="-1"><a class="header-anchor" href="#三、list中一些函数的源码实现"><span>三、list中一些函数的源码实现</span></a></h2><ol><li>将元素插入到list表头，如下图所示，向表头插入val0之后list的变化，红色的相关指针是发生变化的指针。</li></ol><figure><img src="http://zzk31.320.io/img/20230521230420.png" alt="" tabindex="0" loading="lazy"><figcaption></figcaption></figure><div class="language-C line-numbers-mode" data-ext="C" data-title="C"><pre class="language-C"><code>/*
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
    node-&gt;value = value;

    // 添加节点到空链表
    // 当链表为空时，新插入的节点既是头结点也是尾结点
    if (list-&gt;len == 0) {
        list-&gt;head = list-&gt;tail = node;
        // 注意头结点的前驱指针应该为空，尾结点的后继指针应该为空
        node-&gt;prev = node-&gt;next = NULL;
    // 添加节点到非空链表
    // 当链表非空时,采用头插法将新插入节点链接到链表头部,并更新list的head指针
    } else {
        node-&gt;prev = NULL; //注意头结点的前驱指针应该为空
        node-&gt;next = list-&gt;head;
        list-&gt;head-&gt;prev = node;
        list-&gt;head = node;
    }

    // 更新链表节点数
    list-&gt;len++;

    return list;
}
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><ol start="2"><li>将元素插入到list表尾，如下图所示，想表尾插入val5之后list的变化，红色的相关指针是发生变化的指针。</li></ol><figure><img src="http://zzk31.320.io/img/20230521230452.png" alt="" tabindex="0" loading="lazy"><figcaption></figcaption></figure><div class="language-C line-numbers-mode" data-ext="C" data-title="C"><pre class="language-C"><code>/*
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
    node-&gt;value = value;

    // 目标链表为空
    // 当链表为空时，新插入的节点既是头结点也是尾结点
    if (list-&gt;len == 0) {
        list-&gt;head = list-&gt;tail = node;
        // 注意头结点的前驱指针应该为空，尾结点的后继指针应该为空
        node-&gt;prev = node-&gt;next = NULL;
    // 目标链表非空
    } else {
        node-&gt;prev = list-&gt;tail;
        node-&gt;next = NULL;
        list-&gt;tail-&gt;next = node;
        list-&gt;tail = node;
    }

    // 更新链表节点数
    list-&gt;len++;

    return list;
}
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><ol start="3"><li>创建list，如下图所示，其中NULL指针没有画出：</li></ol><figure><img src="http://zzk31.320.io/img/20230521230555.png" alt="" tabindex="0" loading="lazy"><figcaption></figcaption></figure><div class="language-C line-numbers-mode" data-ext="C" data-title="C"><pre class="language-C"><code>/*
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
    list-&gt;head = list-&gt;tail = NULL;
    list-&gt;len = 0;
    list-&gt;dup = NULL;
    list-&gt;free = NULL;
    list-&gt;match = NULL;

    return list;
}
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div>`,30);function m(p,b){const n=l("ExternalLinkIcon");return a(),t("div",null,[c,e("blockquote",null,[e("p",null,[i("本系列是个人的Redis学习笔记，参考的书籍有《Redis设计与实现》、《Redis深度历险--核心原理与应用实践》，Redis源码版本是黄健宏老师注释的"),e("a",o,[i("Redis-3.0-annotated"),d(n)]),i("版本")])]),u])}const k=s(v,[["render",m],["__file","redis-learn-list.html.vue"]]),f=JSON.parse('{"path":"/middleware/redis/redis-learn-list.html","title":"Redis学习笔记之链表","lang":"zh-CN","frontmatter":{"title":"Redis学习笔记之链表","category":"中间件","date":"2023-10-14T00:00:00.000Z","tag":["Redis"],"description":"拉个Star 如果本知识库的内容帮助到你，还请点个免费的Star，感谢。传送门：GitHub 本系列是个人的Redis学习笔记，参考的书籍有《Redis设计与实现》、《Redis深度历险--核心原理与应用实践》，Redis源码版本是黄健宏老师注释的Redis-3.0-annotated版本 一、Redis中的链表应用场景 链表是一种应用非常广泛的数据结...","head":[["meta",{"property":"og:url","content":"https://kkwalking.github.com/person-database/person-database/middleware/redis/redis-learn-list.html"}],["meta",{"property":"og:site_name","content":"zzk的个人知识库"}],["meta",{"property":"og:title","content":"Redis学习笔记之链表"}],["meta",{"property":"og:description","content":"拉个Star 如果本知识库的内容帮助到你，还请点个免费的Star，感谢。传送门：GitHub 本系列是个人的Redis学习笔记，参考的书籍有《Redis设计与实现》、《Redis深度历险--核心原理与应用实践》，Redis源码版本是黄健宏老师注释的Redis-3.0-annotated版本 一、Redis中的链表应用场景 链表是一种应用非常广泛的数据结..."}],["meta",{"property":"og:type","content":"article"}],["meta",{"property":"og:image","content":"http://zzk31.320.io/img/20230521171907.png"}],["meta",{"property":"og:locale","content":"zh-CN"}],["meta",{"property":"og:updated_time","content":"2024-03-18T06:18:38.000Z"}],["meta",{"name":"twitter:card","content":"summary_large_image"}],["meta",{"name":"twitter:image:alt","content":"Redis学习笔记之链表"}],["meta",{"property":"article:author","content":"zzk"}],["meta",{"property":"article:tag","content":"Redis"}],["meta",{"property":"article:published_time","content":"2023-10-14T00:00:00.000Z"}],["meta",{"property":"article:modified_time","content":"2024-03-18T06:18:38.000Z"}],["script",{"type":"application/ld+json"},"{\\"@context\\":\\"https://schema.org\\",\\"@type\\":\\"Article\\",\\"headline\\":\\"Redis学习笔记之链表\\",\\"image\\":[\\"http://zzk31.320.io/img/20230521171907.png\\",\\"http://zzk31.320.io/img/20230521172758.png\\",\\"http://zzk31.320.io/img/20230521230420.png\\",\\"http://zzk31.320.io/img/20230521230452.png\\",\\"http://zzk31.320.io/img/20230521230555.png\\"],\\"datePublished\\":\\"2023-10-14T00:00:00.000Z\\",\\"dateModified\\":\\"2024-03-18T06:18:38.000Z\\",\\"author\\":[{\\"@type\\":\\"Person\\",\\"name\\":\\"zzk\\",\\"url\\":\\"https://github.com/kkwalking\\"}]}"]]},"headers":[{"level":2,"title":"一、Redis中的链表应用场景","slug":"一、redis中的链表应用场景","link":"#一、redis中的链表应用场景","children":[]},{"level":2,"title":"二、Redis的链表实现","slug":"二、redis的链表实现","link":"#二、redis的链表实现","children":[]},{"level":2,"title":"三、list中一些函数的源码实现","slug":"三、list中一些函数的源码实现","link":"#三、list中一些函数的源码实现","children":[]}],"git":{"createdTime":1710233727000,"updatedTime":1710742718000,"contributors":[{"name":"zhouzekun","email":"zhouzk3@chinatelecom.cn","commits":2}]},"readingTime":{"minutes":5.44,"words":1633},"filePathRelative":"middleware/redis/redis-learn-list.md","localizedDate":"2023年10月14日","excerpt":"<div class=\\"hint-container tip\\">\\n<p class=\\"hint-container-title\\">拉个Star</p>\\n<ul>\\n<li>如果<a href=\\"https://github.com/shzyjbr/person-database\\" target=\\"blank\\">本知识库</a>的内容帮助到你，还请点个免费的Star，感谢。传送门：<a href=\\"https://github.com/shzyjbr/person-database\\" target=\\"blank\\">GitHub</a></li>\\n</ul>\\n</div>\\n<blockquote>\\n<p>本系列是个人的Redis学习笔记，参考的书籍有《Redis设计与实现》、《Redis深度历险--核心原理与应用实践》，Redis源码版本是黄健宏老师注释的<a href=\\"https://github.com/huangz1990/redis-3.0-annotated\\" target=\\"_blank\\" rel=\\"noopener noreferrer\\">Redis-3.0-annotated</a>版本</p>\\n</blockquote>","autoDesc":true}');export{k as comp,f as data};
