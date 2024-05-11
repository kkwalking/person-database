---
title: 使用jlink和jpackage对javafx打包成可执行程序和可安装程序
date: 2024-05-11
tag: 
  - Java
  - JavaFX
--- 
 > 关于java项目如何打包成一个可执行程序一直是个令人困扰的问题，我是因为使用javafx做桌面端程序才开始研究这个打包问题，这个是我目前在两台电脑上尝试可行的方案，针对的是模块化项目，jdk是21（实测过17的也是ok的）。主要就是使用jlink的maven插件，然后使用jdk自带的jpackage打出一个带运行时的文件夹，再用jpackage的其他选项可以在该基础上继续打包成可安装程序。 以下操作均在win 10下进行。不清楚是否需要安装wix3，我是安装了，建议可以提前先安装一下。

# 一、maven配置如下插件

```xml
<plugins>
        <plugin>
            <groupId>org.apache.maven.plugins</groupId>
            <artifactId>maven-compiler-plugin</artifactId>
            <version>3.11.0</version>
            <configuration>
                <source>21</source>
                <target>21</target>
            </configuration>
        </plugin>
        <plugin>
            <groupId>org.openjfx</groupId>
            <artifactId>javafx-maven-plugin</artifactId>
            <version>0.0.8</version>
            <executions>
                <execution>
                    <!-- Default configuration for running with: mvn clean javafx:run -->
                    <id>default-cli</id>
                    <configuration>
                        <mainClass>com.kelton.gatewayconverter/com.kelton.gatewayconverter.BootApplication</mainClass>
                        <launcher>app</launcher>
                        <jlinkZipName>app</jlinkZipName>
                        <jlinkImageName>app</jlinkImageName>
                        <noManPages>true</noManPages>
                        <stripDebug>true</stripDebug>
                        <noHeaderFiles>true</noHeaderFiles>
                    </configuration>
                </execution>
            </executions>
        </plugin>
    </plugins>
```

关于插件配置项的一些简单介绍：

- `mainClass`指定启动类，指定格式采用 *模块名/带包名的完整类路径*

- `jlinkImageName`指定输出的文件夹名称

- `jlinkZipName` 指定压缩`jlinkImageName` 文件夹之后产生的zip压缩包文件名

# 二、控制台执行命令

**第一步，在该目录控制台下输入命令**

```powershell
mvn javafx:jlink
```

该命令是调用javafx的maven插件，使用jlink进行打包

> 如果采用的依赖没有支持模块化，则打包会出现无法使用自动化模块的错误。请接着看文末的解决方案。

**第二步，在当前项目根目录下使用该命令**

```powershell
jpackage --type app-image -n gateway-converter -m "com.kelton.gatewayconverter/com.kelton.gatewayconverter.BootApplication" --icon "D:\code\gateway-converter\src\main\r
esources\logo.ico" --runtime-image ".\target\app" --dest ".\target\build-package"
```

该命令的一些参数解释:
-  `-m`参数指定启动类
- `-n`指定打包后可执行文件的文件名
- `--icon` 指定logo的位置
- `--runtime-image` 指定从哪个目录构建打包文件。这里的.\target\app正是使用mvn javafx:jlink 命令打包出来的文件目录（是在javafx-maven-plugin插件中`jlinkImageName`标签中配置的）
- `--dest` 指定打包输出文件夹

**最后，执行如下命令打包出可安装程序.exe**

```powershell
jpackage.exe -n gateway-converter --app-image .\target\build-package\gateway-converter --app-version 1.0 --dest .\target\build-link-package --temp .\target\build-link-package\temp --win-dir-chooser --win-menu --win-menu-group gateway-converter --win-shortcut
```

# 附：关于采用的依赖没有支持模块化的解决方案

> 这个方案来自油管上的一个up主，v=bO6f3U4i0A0

如果采用的依赖没有支持模块化，可以采用如下三个命令，为非模块化的依赖生成模块化声明

```powershell
jdeps --ignore-missing-deps --generate-module-info jars jars/postgresql-42.2.18.jar

javac --patch-module org.postgresql.jdbc=jars/postgresql-42.2.18.jar jars/module-info.java

jar uf jars/postgresql-42.2.18.jar -C jars module-info.class
```

下面解释一下如何用这三个命令

首先，先用jdeps命令来为某个非模块化的jar包生成module-info.java

接着，用javac命令来编译生成module-info.class

最后，jar uf 命令来将module-info.class合并到原来的非模块化jar包

以hutool-all这个非模块化包为例

第一步，cmd转到对应的maven仓库目录下面，如D:\software\apache-maven-3.9.2\maven-repository\cn\hutool\hutool-all\5.8.11

然后执行第一个命令

```powershell
jdeps --ignore-missing-deps --generate-module-info jars hutool-all-5.8.11.jar
```

这会在当前目录下生成 jar/hutool.all/module-info.java

第二步，把这个module-info.java复制到当前jar包目录下(也可以不复制，指定好路径就行)，执行第二个命令

```powershell
javac --patch-module hutool.all=hutool-all-5.8.11.jar module-info.java

```

这会在当前目录生成编译好的module-info.class, 如下图所示

![module-info.class截图](http://zzk31.320.io/img/20240511095820.png)

第三步，执行命令
```powershell
jar uf hutool-all-5.8.11.jar module-info.class
```

这会将当前目录下面的module-info.class合并到hutool-all-5.8.11.jar中，使其成为模块化jar包

项目打包参考源码，是我正在写的一个Redis客户端项目，github地址：<a href='https://github.com/kkwalking/walkingman-rdm' target='blank'>walkingman-rdm</a>

::: tip 拉个Star
- 最后，如果<a href='https://github.com/kkwalking/person-database' target='blank'>本知识库</a>的内容帮助到你，还请点个免费的Star，感谢。传送门：<a href='https://github.com/kkwalking/person-database' target='blank'>GitHub</a>
:::