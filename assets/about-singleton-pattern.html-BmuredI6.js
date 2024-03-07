import{_ as n}from"./plugin-vue_export-helper-DlAUqK2U.js";import{o as s,c as a,e}from"./app-vk17gLsD.js";const t={},p=e(`<h1 id="浅谈单例模式" tabindex="-1"><a class="header-anchor" href="#浅谈单例模式"><span>浅谈单例模式</span></a></h1><h4 id="饿汉模式" tabindex="-1"><a class="header-anchor" href="#饿汉模式"><span>饿汉模式</span></a></h4><div class="language-java line-numbers-mode" data-ext="java" data-title="java"><pre class="language-java"><code><span class="token keyword">public</span> <span class="token keyword">class</span> <span class="token class-name">Singleton</span> <span class="token punctuation">{</span>
    <span class="token keyword">private</span> <span class="token keyword">static</span> <span class="token class-name">Singleton</span> instance <span class="token operator">=</span> <span class="token keyword">new</span> <span class="token class-name">Singleton</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
    <span class="token keyword">private</span> <span class="token class-name">Singleton</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span><span class="token punctuation">}</span>
    <span class="token keyword">public</span> <span class="token keyword">static</span> <span class="token class-name">Singleton</span> <span class="token function">newInstance</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
        <span class="token keyword">return</span> instance<span class="token punctuation">;</span>
    <span class="token punctuation">}</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>缺点：在需要初始化许多对象的时候会导致系统启动较慢，比如在有许多个单例对象的容器中，启动该容器的初始过程会比较长。</p><h4 id="懒加载模式" tabindex="-1"><a class="header-anchor" href="#懒加载模式"><span>懒加载模式</span></a></h4><div class="language-java line-numbers-mode" data-ext="java" data-title="java"><pre class="language-java"><code><span class="token keyword">public</span> <span class="token keyword">class</span> <span class="token class-name">Singleton</span> <span class="token punctuation">{</span>
    <span class="token keyword">private</span> <span class="token keyword">static</span> <span class="token class-name">Singleton</span> instance <span class="token operator">=</span> <span class="token keyword">null</span><span class="token punctuation">;</span>
    
    <span class="token keyword">private</span> <span class="token class-name">Singleton</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">{</span><span class="token punctuation">}</span>
    
    <span class="token keyword">public</span> <span class="token keyword">static</span> <span class="token keyword">synchronized</span> <span class="token class-name">Singleton</span> <span class="token function">getInstance</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
        <span class="token keyword">if</span><span class="token punctuation">(</span>instance <span class="token operator">==</span> <span class="token keyword">null</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
            instance <span class="token operator">=</span> <span class="token keyword">new</span> <span class="token class-name">Singleton</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
        <span class="token punctuation">}</span>
        <span class="token keyword">return</span> instance<span class="token punctuation">;</span>
    <span class="token punctuation">}</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>缺点：同步方法锁住了对象，降低了系统的处理速度。</p><h4 id="错误的双重锁检查" tabindex="-1"><a class="header-anchor" href="#错误的双重锁检查"><span>错误的双重锁检查</span></a></h4><div class="language-java line-numbers-mode" data-ext="java" data-title="java"><pre class="language-java"><code><span class="token keyword">public</span> <span class="token keyword">class</span> <span class="token class-name">Singleton</span> <span class="token punctuation">{</span>
    <span class="token keyword">private</span> <span class="token keyword">static</span> <span class="token class-name">Singleton</span> instance <span class="token operator">=</span> <span class="token keyword">null</span><span class="token punctuation">;</span>
    <span class="token keyword">private</span> <span class="token class-name">Singleton</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">{</span><span class="token punctuation">}</span>
    <span class="token keyword">public</span> <span class="token keyword">static</span> <span class="token class-name">Singleton</span> <span class="token function">getInstance</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
        <span class="token keyword">if</span><span class="token punctuation">(</span>instance <span class="token operator">==</span> <span class="token keyword">null</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
            <span class="token keyword">synchronized</span><span class="token punctuation">(</span><span class="token class-name">Singleton</span><span class="token punctuation">.</span><span class="token keyword">class</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
                <span class="token keyword">if</span><span class="token punctuation">(</span>instance <span class="token operator">==</span> <span class="token keyword">null</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
                    instance <span class="token operator">=</span> <span class="token keyword">new</span> <span class="token class-name">Singleton</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
                <span class="token punctuation">}</span>
            <span class="token punctuation">}</span>
        <span class="token punctuation">}</span>
        <span class="token keyword">return</span> instance<span class="token punctuation">;</span>
    <span class="token punctuation">}</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>这样的写法是有问题的。在JVM中， instance = new Singleton(); 语句并不是一个原子操作，分为创建对象和引用赋值两步。其中，创建对象需要为对象分配空间，再进行初始化。以上三步，分配内存永远是第一步，但是后面两步则可能被重排序。</p><p>JVM并不保证初始化先于引用赋值的顺序，因此很可能是先创建了对象，即在Singleton实例分配了内存空间，但是还未进行初始化，然后赋值给了<code>instance</code>，这是实例虽然分配到了空间，但是其并未完成初始化，而<code>instance</code>引用却不为空，这时另一个线程抢占执行，执行了<code>getInstance（）</code>方法，便会发现<code>instance</code>不为<code>null</code>，从而直接返回了<code>instance</code>，导致系统出错。</p><h4 id="正确的双重锁检查" tabindex="-1"><a class="header-anchor" href="#正确的双重锁检查"><span>正确的双重锁检查</span></a></h4><div class="language-java line-numbers-mode" data-ext="java" data-title="java"><pre class="language-java"><code><span class="token keyword">public</span> <span class="token keyword">class</span> <span class="token class-name">Singleton</span> <span class="token punctuation">{</span>
    <span class="token keyword">private</span> <span class="token keyword">static</span> <span class="token keyword">volatile</span> <span class="token class-name">Singleton</span> instance <span class="token operator">=</span> <span class="token keyword">null</span><span class="token punctuation">;</span>
    <span class="token keyword">private</span> <span class="token class-name">Singleton</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">{</span><span class="token punctuation">}</span>
    <span class="token keyword">public</span> <span class="token keyword">static</span> <span class="token class-name">Singleton</span> <span class="token function">getInstance</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
        <span class="token keyword">if</span><span class="token punctuation">(</span>instance <span class="token operator">==</span> <span class="token keyword">null</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
            <span class="token keyword">synchronized</span><span class="token punctuation">(</span><span class="token class-name">Singleton</span><span class="token punctuation">.</span><span class="token keyword">class</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
                <span class="token keyword">if</span><span class="token punctuation">(</span>instance <span class="token operator">==</span> <span class="token keyword">null</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
                    instance <span class="token operator">=</span> <span class="token keyword">new</span> <span class="token class-name">Singleton</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
                <span class="token punctuation">}</span>
            <span class="token punctuation">}</span>
        <span class="token punctuation">}</span>
        <span class="token keyword">return</span> instance<span class="token punctuation">;</span>
    <span class="token punctuation">}</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>利用volatile的内存可见性可以使得<code>instance</code>不会被线程缓存，所有的线程读写该对象都需要对主内存进行操作。</p><p>volatile还可以防止指令重排序，从而使得上述的双重锁检查代码正确执行。这里的防止指令重排序是指，volatile修饰的<code>instance</code>对象，在执行代码 <code>instance = new Singleton()</code>时不会再被JVM进行指令重排序，会按照 <code>内存分配 -&gt; 初始化 -&gt; 引用赋值</code> 的顺序执行</p><h4 id="使用静态内部类" tabindex="-1"><a class="header-anchor" href="#使用静态内部类"><span>使用静态内部类</span></a></h4><div class="language-java line-numbers-mode" data-ext="java" data-title="java"><pre class="language-java"><code><span class="token keyword">public</span> <span class="token keyword">class</span> <span class="token class-name">Singleton</span> <span class="token punctuation">{</span>
    <span class="token keyword">private</span> <span class="token class-name">Singleton</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span><span class="token punctuation">}</span>
    <span class="token keyword">private</span> <span class="token keyword">static</span> <span class="token keyword">class</span> <span class="token class-name">SingletonFactory</span> <span class="token punctuation">{</span>
        <span class="token keyword">private</span> <span class="token keyword">static</span> <span class="token class-name">Singleton</span> instance <span class="token operator">=</span> <span class="token keyword">new</span> <span class="token class-name">Singleton</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
    <span class="token punctuation">}</span>
    <span class="token keyword">public</span> <span class="token keyword">static</span> <span class="token class-name">Singleton</span> <span class="token function">getInstance</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
        <span class="token keyword">return</span> <span class="token class-name">SingletonFactory</span><span class="token punctuation">.</span>instance<span class="token punctuation">;</span>
    <span class="token punctuation">}</span>
    <span class="token comment">//序列化方法  可忽略</span>
    <span class="token keyword">public</span> <span class="token class-name">Object</span> <span class="token function">readResolve</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
        <span class="token keyword">return</span> <span class="token function">getInstance</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
    <span class="token punctuation">}</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>这样的写法利用了JVM的类加载机制，JVM在加载类的过程中确保了线程互斥，是线程安全的。外部类被加载时，不会立即加载内部类，从而<code>instance</code>不会立即被实例化。当<code>getInstance()</code> 第一次被调用时，内部类第一次被引用，从而加载了内部类，并完成了<code>instance</code>的实例化，而JVM的类加载机制确保了实例化instance的过程中的线程安全性。</p><p>缺点：使用静态内部类的方式，则存在传参的问题，外部无法传递参数给内部类</p><h4 id="使用枚举" tabindex="-1"><a class="header-anchor" href="#使用枚举"><span>使用枚举</span></a></h4><div class="language-java line-numbers-mode" data-ext="java" data-title="java"><pre class="language-java"><code><span class="token keyword">public</span> <span class="token keyword">enum</span> <span class="token class-name">Singleton</span> <span class="token punctuation">{</span>
    <span class="token constant">INSTANCE</span><span class="token punctuation">;</span>
    <span class="token punctuation">.</span><span class="token punctuation">.</span><span class="token punctuation">.</span>  <span class="token comment">//其他方法代码</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>枚举类型的实例创建出来天然就是单例的，并且是线程安全的。</p>`,22),c=[p];function o(l,i){return s(),a("div",null,c)}const d=n(t,[["render",o],["__file","about-singleton-pattern.html.vue"]]),r=JSON.parse('{"path":"/java/about-singleton-pattern.html","title":"浅谈单例模式","lang":"zh-CN","frontmatter":{"title":"浅谈单例模式","tags":"设计模式","description":"浅谈单例模式 饿汉模式 缺点：在需要初始化许多对象的时候会导致系统启动较慢，比如在有许多个单例对象的容器中，启动该容器的初始过程会比较长。 懒加载模式 缺点：同步方法锁住了对象，降低了系统的处理速度。 错误的双重锁检查 这样的写法是有问题的。在JVM中， instance = new Singleton(); 语句并不是一个原子操作，分为创建对象和引用...","head":[["meta",{"property":"og:url","content":"https://github.com/shzyjbr/java/about-singleton-pattern.html"}],["meta",{"property":"og:site_name","content":"zzk的个人知识库"}],["meta",{"property":"og:title","content":"浅谈单例模式"}],["meta",{"property":"og:description","content":"浅谈单例模式 饿汉模式 缺点：在需要初始化许多对象的时候会导致系统启动较慢，比如在有许多个单例对象的容器中，启动该容器的初始过程会比较长。 懒加载模式 缺点：同步方法锁住了对象，降低了系统的处理速度。 错误的双重锁检查 这样的写法是有问题的。在JVM中， instance = new Singleton(); 语句并不是一个原子操作，分为创建对象和引用..."}],["meta",{"property":"og:type","content":"article"}],["meta",{"property":"og:locale","content":"zh-CN"}],["meta",{"property":"og:updated_time","content":"2024-03-07T09:41:42.000Z"}],["meta",{"property":"article:author","content":"zzk"}],["meta",{"property":"article:modified_time","content":"2024-03-07T09:41:42.000Z"}],["script",{"type":"application/ld+json"},"{\\"@context\\":\\"https://schema.org\\",\\"@type\\":\\"Article\\",\\"headline\\":\\"浅谈单例模式\\",\\"image\\":[\\"\\"],\\"dateModified\\":\\"2024-03-07T09:41:42.000Z\\",\\"author\\":[{\\"@type\\":\\"Person\\",\\"name\\":\\"zzk\\",\\"url\\":\\"https://github.com/shzyjbr\\"}]}"]]},"headers":[],"git":{"createdTime":1709804502000,"updatedTime":1709804502000,"contributors":[{"name":"zhouzekun","email":"zhouzk3@chinatelecom.cn","commits":1}]},"readingTime":{"minutes":2.67,"words":802},"filePathRelative":"java/about-singleton-pattern.md","localizedDate":"2024年3月7日","excerpt":"\\n<h4>饿汉模式</h4>\\n<div class=\\"language-java\\" data-ext=\\"java\\" data-title=\\"java\\"><pre class=\\"language-java\\"><code><span class=\\"token keyword\\">public</span> <span class=\\"token keyword\\">class</span> <span class=\\"token class-name\\">Singleton</span> <span class=\\"token punctuation\\">{</span>\\n    <span class=\\"token keyword\\">private</span> <span class=\\"token keyword\\">static</span> <span class=\\"token class-name\\">Singleton</span> instance <span class=\\"token operator\\">=</span> <span class=\\"token keyword\\">new</span> <span class=\\"token class-name\\">Singleton</span><span class=\\"token punctuation\\">(</span><span class=\\"token punctuation\\">)</span><span class=\\"token punctuation\\">;</span>\\n    <span class=\\"token keyword\\">private</span> <span class=\\"token class-name\\">Singleton</span><span class=\\"token punctuation\\">(</span><span class=\\"token punctuation\\">)</span> <span class=\\"token punctuation\\">{</span><span class=\\"token punctuation\\">}</span>\\n    <span class=\\"token keyword\\">public</span> <span class=\\"token keyword\\">static</span> <span class=\\"token class-name\\">Singleton</span> <span class=\\"token function\\">newInstance</span><span class=\\"token punctuation\\">(</span><span class=\\"token punctuation\\">)</span> <span class=\\"token punctuation\\">{</span>\\n        <span class=\\"token keyword\\">return</span> instance<span class=\\"token punctuation\\">;</span>\\n    <span class=\\"token punctuation\\">}</span>\\n<span class=\\"token punctuation\\">}</span>\\n</code></pre></div>","autoDesc":true}');export{d as comp,r as data};
