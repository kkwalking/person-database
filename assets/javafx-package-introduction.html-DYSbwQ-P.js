import{_ as a}from"./plugin-vue_export-helper-DlAUqK2U.js";import{o as n,c as s,d as t}from"./app-DANWba4q.js";const e={},p=t(`<blockquote><p>关于java项目如何打包成一个可执行程序一直是个令人困扰的问题，我是因为使用javafx做桌面端程序才开始研究这个打包问题，这个是我目前在两台电脑上尝试可行的方案，针对的是模块化项目，jdk是21（实测过17的也是ok的）。主要就是使用jlink的maven插件，然后使用jdk自带的jpackage打出一个带运行时的文件夹，再用jpackage的其他选项可以在该基础上继续打包成可安装程序。 以下操作均在win 10下进行。不清楚是否需要安装wix3，我是安装了，建议可以提前先安装一下。</p></blockquote><h1 id="一、maven配置如下插件" tabindex="-1"><a class="header-anchor" href="#一、maven配置如下插件"><span>一、maven配置如下插件</span></a></h1><div class="language-xml line-numbers-mode" data-ext="xml" data-title="xml"><pre class="language-xml"><code><span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>plugins</span><span class="token punctuation">&gt;</span></span>
        <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>plugin</span><span class="token punctuation">&gt;</span></span>
            <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>groupId</span><span class="token punctuation">&gt;</span></span>org.apache.maven.plugins<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>groupId</span><span class="token punctuation">&gt;</span></span>
            <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>artifactId</span><span class="token punctuation">&gt;</span></span>maven-compiler-plugin<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>artifactId</span><span class="token punctuation">&gt;</span></span>
            <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>version</span><span class="token punctuation">&gt;</span></span>3.11.0<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>version</span><span class="token punctuation">&gt;</span></span>
            <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>configuration</span><span class="token punctuation">&gt;</span></span>
                <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>source</span><span class="token punctuation">&gt;</span></span>21<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>source</span><span class="token punctuation">&gt;</span></span>
                <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>target</span><span class="token punctuation">&gt;</span></span>21<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>target</span><span class="token punctuation">&gt;</span></span>
            <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>configuration</span><span class="token punctuation">&gt;</span></span>
        <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>plugin</span><span class="token punctuation">&gt;</span></span>
        <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>plugin</span><span class="token punctuation">&gt;</span></span>
            <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>groupId</span><span class="token punctuation">&gt;</span></span>org.openjfx<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>groupId</span><span class="token punctuation">&gt;</span></span>
            <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>artifactId</span><span class="token punctuation">&gt;</span></span>javafx-maven-plugin<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>artifactId</span><span class="token punctuation">&gt;</span></span>
            <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>version</span><span class="token punctuation">&gt;</span></span>0.0.8<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>version</span><span class="token punctuation">&gt;</span></span>
            <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>executions</span><span class="token punctuation">&gt;</span></span>
                <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>execution</span><span class="token punctuation">&gt;</span></span>
                    <span class="token comment">&lt;!-- Default configuration for running with: mvn clean javafx:run --&gt;</span>
                    <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>id</span><span class="token punctuation">&gt;</span></span>default-cli<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>id</span><span class="token punctuation">&gt;</span></span>
                    <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>configuration</span><span class="token punctuation">&gt;</span></span>
                        <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>mainClass</span><span class="token punctuation">&gt;</span></span>com.kelton.gatewayconverter/com.kelton.gatewayconverter.BootApplication<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>mainClass</span><span class="token punctuation">&gt;</span></span>
                        <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>launcher</span><span class="token punctuation">&gt;</span></span>app<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>launcher</span><span class="token punctuation">&gt;</span></span>
                        <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>jlinkZipName</span><span class="token punctuation">&gt;</span></span>app<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>jlinkZipName</span><span class="token punctuation">&gt;</span></span>
                        <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>jlinkImageName</span><span class="token punctuation">&gt;</span></span>app<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>jlinkImageName</span><span class="token punctuation">&gt;</span></span>
                        <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>noManPages</span><span class="token punctuation">&gt;</span></span>true<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>noManPages</span><span class="token punctuation">&gt;</span></span>
                        <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>stripDebug</span><span class="token punctuation">&gt;</span></span>true<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>stripDebug</span><span class="token punctuation">&gt;</span></span>
                        <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>noHeaderFiles</span><span class="token punctuation">&gt;</span></span>true<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>noHeaderFiles</span><span class="token punctuation">&gt;</span></span>
                    <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>configuration</span><span class="token punctuation">&gt;</span></span>
                <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>execution</span><span class="token punctuation">&gt;</span></span>
            <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>executions</span><span class="token punctuation">&gt;</span></span>
        <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>plugin</span><span class="token punctuation">&gt;</span></span>
    <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>plugins</span><span class="token punctuation">&gt;</span></span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>关于插件配置项的一些简单介绍：</p><ul><li><p><code>mainClass</code>指定启动类，指定格式采用 <em>模块名/带包名的完整类路径</em></p></li><li><p><code>jlinkImageName</code>指定输出的文件夹名称</p></li><li><p><code>jlinkZipName</code> 指定压缩<code>jlinkImageName</code> 文件夹之后产生的zip压缩包文件名</p></li></ul><h1 id="二、控制台执行命令" tabindex="-1"><a class="header-anchor" href="#二、控制台执行命令"><span>二、控制台执行命令</span></a></h1><p><strong>第一步，在该目录控制台下输入命令</strong></p><div class="language-powershell line-numbers-mode" data-ext="powershell" data-title="powershell"><pre class="language-powershell"><code>mvn javafx:jlink
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><p>该命令是调用javafx的maven插件，使用jlink进行打包</p><blockquote><p>如果采用的依赖没有支持模块化，则打包会出现无法使用自动化模块的错误。请接着看文末的解决方案。</p></blockquote><p><strong>第二步，在当前项目根目录下使用该命令</strong></p><div class="language-powershell line-numbers-mode" data-ext="powershell" data-title="powershell"><pre class="language-powershell"><code>jpackage <span class="token operator">--</span><span class="token function">type</span> app-image <span class="token operator">-</span>n gateway-converter <span class="token operator">-</span>m <span class="token string">&quot;com.kelton.gatewayconverter/com.kelton.gatewayconverter.BootApplication&quot;</span> <span class="token operator">--</span>icon <span class="token string">&quot;D:\\code\\gateway-converter\\src\\main\\r
esources\\logo.ico&quot;</span> <span class="token operator">--</span>runtime-image <span class="token string">&quot;.\\target\\app&quot;</span> <span class="token operator">--</span>dest <span class="token string">&quot;.\\target\\build-package&quot;</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div></div></div><p>该命令的一些参数解释:</p><ul><li><code>-m</code>参数指定启动类</li><li><code>-n</code>指定打包后可执行文件的文件名</li><li><code>--icon</code> 指定logo的位置</li><li><code>--runtime-image</code> 指定从哪个目录构建打包文件。这里的.\\target\\app正是使用mvn javafx:jlink 命令打包出来的文件目录（是在javafx-maven-plugin插件中<code>jlinkImageName</code>标签中配置的）</li><li><code>--dest</code> 指定打包输出文件夹</li></ul><p><strong>最后，执行如下命令打包出可安装程序.exe</strong></p><div class="language-powershell line-numbers-mode" data-ext="powershell" data-title="powershell"><pre class="language-powershell"><code>jpackage<span class="token punctuation">.</span>exe <span class="token operator">-</span>n gateway-converter <span class="token operator">--</span>app-image <span class="token punctuation">.</span>\\target\\build-package\\gateway-converter <span class="token operator">--</span>app-version 1<span class="token punctuation">.</span>0 <span class="token operator">--</span>dest <span class="token punctuation">.</span>\\target\\build-link-package <span class="token operator">--</span>temp <span class="token punctuation">.</span>\\target\\build-link-package\\temp <span class="token operator">--</span>win-<span class="token function">dir</span><span class="token operator">-</span>chooser <span class="token operator">--</span>win-menu <span class="token operator">--</span>win-menu-<span class="token function">group</span> gateway-converter <span class="token operator">--</span>win-shortcut
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><h1 id="附-关于采用的依赖没有支持模块化的解决方案" tabindex="-1"><a class="header-anchor" href="#附-关于采用的依赖没有支持模块化的解决方案"><span>附：关于采用的依赖没有支持模块化的解决方案</span></a></h1><blockquote><p>这个方案来自油管上的一个up主，v=bO6f3U4i0A0</p></blockquote><p>如果采用的依赖没有支持模块化，可以采用如下三个命令，为非模块化的依赖生成模块化声明</p><div class="language-powershell line-numbers-mode" data-ext="powershell" data-title="powershell"><pre class="language-powershell"><code>jdeps <span class="token operator">--</span>ignore-missing-deps <span class="token operator">--</span>generate-module-info jars jars/postgresql-42<span class="token punctuation">.</span>2<span class="token punctuation">.</span>18<span class="token punctuation">.</span>jar

javac <span class="token operator">--</span>patch-module org<span class="token punctuation">.</span>postgresql<span class="token punctuation">.</span>jdbc=jars/postgresql-42<span class="token punctuation">.</span>2<span class="token punctuation">.</span>18<span class="token punctuation">.</span>jar jars/module-info<span class="token punctuation">.</span>java

jar uf jars/postgresql-42<span class="token punctuation">.</span>2<span class="token punctuation">.</span>18<span class="token punctuation">.</span>jar <span class="token operator">-</span>C jars module-info<span class="token punctuation">.</span><span class="token keyword">class</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>下面解释一下如何用这三个命令</p><p>首先，先用jdeps命令来为某个非模块化的jar包生成module-info.java</p><p>接着，用javac命令来编译生成module-info.class</p><p>最后，jar uf 命令来将module-info.class合并到原来的非模块化jar包</p><p>以hutool-all这个非模块化包为例</p><p>第一步，cmd转到对应的maven仓库目录下面，如D:\\software\\apache-maven-3.9.2\\maven-repository\\cn\\hutool\\hutool-all\\5.8.11</p><p>然后执行第一个命令</p><div class="language-powershell line-numbers-mode" data-ext="powershell" data-title="powershell"><pre class="language-powershell"><code>jdeps <span class="token operator">--</span>ignore-missing-deps <span class="token operator">--</span>generate-module-info jars hutool-all-5<span class="token punctuation">.</span>8<span class="token punctuation">.</span>11<span class="token punctuation">.</span>jar
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><p>这会在当前目录下生成 jar/hutool.all/module-info.java</p><p>第二步，把这个module-info.java复制到当前jar包目录下(也可以不复制，指定好路径就行)，执行第二个命令</p><div class="language-powershell line-numbers-mode" data-ext="powershell" data-title="powershell"><pre class="language-powershell"><code>javac <span class="token operator">--</span>patch-module hutool<span class="token punctuation">.</span>all=hutool-all-5<span class="token punctuation">.</span>8<span class="token punctuation">.</span>11<span class="token punctuation">.</span>jar module-info<span class="token punctuation">.</span>java

</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div></div></div><p>这会在当前目录生成编译好的module-info.class, 如下图所示</p><figure><img src="http://zzk31.320.io/img/20240511095820.png" alt="module-info.class截图" tabindex="0" loading="lazy"><figcaption>module-info.class截图</figcaption></figure><p>第三步，执行命令</p><div class="language-powershell line-numbers-mode" data-ext="powershell" data-title="powershell"><pre class="language-powershell"><code>jar uf hutool-all-5<span class="token punctuation">.</span>8<span class="token punctuation">.</span>11<span class="token punctuation">.</span>jar module-info<span class="token punctuation">.</span><span class="token keyword">class</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><p>这会将当前目录下面的module-info.class合并到hutool-all-5.8.11.jar中，使其成为模块化jar包</p><p>项目打包参考源码，是我正在写的一个Redis客户端项目，github地址：<a href="https://github.com/kkwalking/walkingman-rdm" target="blank">walkingman-rdm</a></p><div class="hint-container tip"><p class="hint-container-title">拉个Star</p><ul><li>最后，如果<a href="https://github.com/kkwalking/person-database" target="blank">本知识库</a>的内容帮助到你，还请点个免费的Star，感谢。传送门：<a href="https://github.com/kkwalking/person-database" target="blank">GitHub</a></li></ul></div>`,38),o=[p];function l(c,i){return n(),s("div",null,o)}const k=a(e,[["render",l],["__file","javafx-package-introduction.html.vue"]]),g=JSON.parse('{"path":"/java/javafx-package-introduction.html","title":"使用jlink和jpackage对javafx打包成可执行程序和可安装程序","lang":"zh-CN","frontmatter":{"title":"使用jlink和jpackage对javafx打包成可执行程序和可安装程序","date":"2024-05-11T00:00:00.000Z","tag":["Java","JavaFX"],"description":"关于java项目如何打包成一个可执行程序一直是个令人困扰的问题，我是因为使用javafx做桌面端程序才开始研究这个打包问题，这个是我目前在两台电脑上尝试可行的方案，针对的是模块化项目，jdk是21（实测过17的也是ok的）。主要就是使用jlink的maven插件，然后使用jdk自带的jpackage打出一个带运行时的文件夹，再用jpackage的其他选...","head":[["meta",{"property":"og:url","content":"https://kkwalking.github.com/person-database/person-database/java/javafx-package-introduction.html"}],["meta",{"property":"og:site_name","content":"zzk的个人知识库"}],["meta",{"property":"og:title","content":"使用jlink和jpackage对javafx打包成可执行程序和可安装程序"}],["meta",{"property":"og:description","content":"关于java项目如何打包成一个可执行程序一直是个令人困扰的问题，我是因为使用javafx做桌面端程序才开始研究这个打包问题，这个是我目前在两台电脑上尝试可行的方案，针对的是模块化项目，jdk是21（实测过17的也是ok的）。主要就是使用jlink的maven插件，然后使用jdk自带的jpackage打出一个带运行时的文件夹，再用jpackage的其他选..."}],["meta",{"property":"og:type","content":"article"}],["meta",{"property":"og:image","content":"http://zzk31.320.io/img/20240511095820.png"}],["meta",{"property":"og:locale","content":"zh-CN"}],["meta",{"property":"og:updated_time","content":"2024-05-11T02:00:06.000Z"}],["meta",{"name":"twitter:card","content":"summary_large_image"}],["meta",{"name":"twitter:image:alt","content":"使用jlink和jpackage对javafx打包成可执行程序和可安装程序"}],["meta",{"property":"article:author","content":"zzk"}],["meta",{"property":"article:tag","content":"Java"}],["meta",{"property":"article:tag","content":"JavaFX"}],["meta",{"property":"article:published_time","content":"2024-05-11T00:00:00.000Z"}],["meta",{"property":"article:modified_time","content":"2024-05-11T02:00:06.000Z"}],["script",{"type":"application/ld+json"},"{\\"@context\\":\\"https://schema.org\\",\\"@type\\":\\"Article\\",\\"headline\\":\\"使用jlink和jpackage对javafx打包成可执行程序和可安装程序\\",\\"image\\":[\\"http://zzk31.320.io/img/20240511095820.png\\"],\\"datePublished\\":\\"2024-05-11T00:00:00.000Z\\",\\"dateModified\\":\\"2024-05-11T02:00:06.000Z\\",\\"author\\":[{\\"@type\\":\\"Person\\",\\"name\\":\\"zzk\\",\\"url\\":\\"https://github.com/kkwalking\\"}]}"]]},"headers":[],"git":{"createdTime":1715392308000,"updatedTime":1715392806000,"contributors":[{"name":"zhouzekun","email":"zhouzk3@chinatelecom.cn","commits":2}]},"readingTime":{"minutes":3.72,"words":1116},"filePathRelative":"java/javafx-package-introduction.md","localizedDate":"2024年5月11日","excerpt":"<blockquote>\\n<p>关于java项目如何打包成一个可执行程序一直是个令人困扰的问题，我是因为使用javafx做桌面端程序才开始研究这个打包问题，这个是我目前在两台电脑上尝试可行的方案，针对的是模块化项目，jdk是21（实测过17的也是ok的）。主要就是使用jlink的maven插件，然后使用jdk自带的jpackage打出一个带运行时的文件夹，再用jpackage的其他选项可以在该基础上继续打包成可安装程序。 以下操作均在win 10下进行。不清楚是否需要安装wix3，我是安装了，建议可以提前先安装一下。</p>\\n</blockquote>\\n<h1>一、maven配置如下插件</h1>","autoDesc":true}');export{k as comp,g as data};