---
title: 项目日志建设之流水日志和程序日志的区分
tags: 项目实践
---
# 项目日志建设之流水日志和程序日志的区分

最近项目要求对程序日志进行两类区分，将日志记录为流水日志和程序日志。

所谓流水日志，更详细的说是请求响应流水日志，记录的是系统执行的请求、响应的内容。其主要方面一般包括后端接口调用、后端调用其他服务接口的请求与响应日志。如果项目有对外向其他系统暴露服务，那么还需要包括其他服务调用本系统接口的请求响应日志。

而程序日志则是我们原来熟知的在程序中记录的一些常规日志，如记录异常请求处理、运行中一些助于排查的信息记录等，可以说是除了流水日志外的其他日志。

此外，除了区分流水日志外，还希望区分info级别的日志文件和debug级别的日志文件。需要说明的是，info级别的日志主要记录在info日志文件中，而对debug级别以上，error级别以下，但不包括info的日志，也就是debug、warn级别日志，记录在debug日志文件中。

如何去做这样的一个日志区分呢？

在动手编写日志配置文件之前，我们可以大概设想一下我们需要的日志文件结构。按照以上要求，对于流水日志，我们需要内容为流水且为info级别的日志文件，还需要内容为流水且为debug级别的日志文件。为方便后续描述，我们可以将流水用trace表示，程序用program表示。日志命名格式上，我们采用`项目名_日志类型-日志级别-日期.log`来命名。举个例子，有一个项目名为hello，那么这个项目在2023年8月29日这天的info级别的流水日志，可以命名为`hello_trace-info-2023-08-29.log`，此外还有`hello_trace-debug-2023-08-29.log`、`hello_program-info-2023-08-29.log`和`hello_program-debug-2023-08-29.log`。假设日志目录为logs，文件结构如下:

```C

-logs
    - hello_trace-info-2023-08-29.log
    - hello_trace-debug-2023-08-29.log
    - hello_program-info-2023-08-29.log
    - hello_program-debug-2023-08-29.log
```



本文采用的日志框架是logback，在Spring Boot项目中搭配使用。

根据以上思路，我们需要在logback配置文件（本文是logback-spring.xml）中配置四个appender来实现向上述四个不同日志文件写入不同日志级别的日志记录。

以请求响应流水日志的appender为例，我们拆解一下这样一个appender需要什么配置，相关的注释我都标注在代码上了

```xml
<appender name="trace_info" class="ch.qos.logback.core.rolling.RollingFileAppender">
    <!--当前级别的日志名称-->
    <File>${log_path}/${app_name}_trace-info-${current_time}.log</File>
    <append>true</append>
    <!--级别过滤器（LevelFilter）,此处只打INFO级别的日志-->
    <filter class="ch.qos.logback.classic.filter.LevelFilter">
        <level>INFO</level>
        <!--下面2个属性表示匹配规定level的接受打印，不匹配的（即非INFO）拒绝打印-->
        <onMatch>ACCEPT</onMatch>
        <onMismatch>DENY</onMismatch>
    </filter>
    <rollingPolicy class="ch.qos.logback.core.rolling.SizeAndTimeBasedRollingPolicy">
        <fileNamePattern>${log_path}/${app_name}_trace-info-%d{yyyyMMdd}-%i.log</fileNamePattern>
        <maxHistory>${logback.file.maxHistory}</maxHistory>
        <maxFileSize>${logback.file.maxFileSize}</maxFileSize>
        <totalSizeCap>${logback.file.totalSizeCap}</totalSizeCap>
    </rollingPolicy>
    <layout class="ch.qos.logback.classic.PatternLayout">
        <pattern>${logback.consolePattern}</pattern>
    </layout>
</appender>
```

`<appender>`:我将这个appender命名为trace_info，表示它是用来记录请求响应流水日志，且其日志记录为info级别。class选择logback提供的一个类，该类可以进行日志文件的滚动更新。所谓滚动更新就是根据相关的滚动配置来创建日志文件。

`<File>`标签中的${log_path}这些都是自定义的变量，比如我的项目的log_path就是logs，${app_name}就是项目名称，比如在这里就是hello，${current_time}表示当前时间，因此组合起来的文件命名格式就是上文描述的。

`<append>`标签表示匹配到响应的日志记录会被追加到日志文件中，而不是覆盖。

filter表达的意义是这是一个只接受INFO级别日志事件的级别筛选器。对于任何非INFO级别的日志事件都将被拒绝。

`<rollingPolicy>`标签使用到logback提供的SizeAndTimeBasedRollingPolicy，这意味着日志文件将根据大小和时间限制进行滚动。`<fileNamePattern>`指定滚动文件名的格式，`<maxHistory>`用于控制日志文件的最大历史记录、`<maxFileSize>`用于控制日志文件滚动前的最大大小和`<totalSizeCap>`表示日志文件的总大小。举个例子，在我的项目中，${logback.file.maxHistory}是3，${logback.file.maxFileSize}是1GB，${logback.file.totalSizeCap}是5GB，这表示最多存在3个滚动日志文件，多了会按日期删除旧的滚动日志文件，每条滚动日志最大大小是1GB，超过1GB就会进行日志文件的滚动，也就是分割出新的日志文件。所有的滚动日志大小加起来不能超过5GB。

`<layout>`用于控制日志输出的格式，这个就没什么好说的，这个大家根据自己的喜好进行定制。

因此，整个appender做的事情就是，定义了请求响应流水日志且日志级别为info的日志要输出到`${log_path}/${app_name}_trace-info-${current_time}.log`这个文件中。当日志文件大小超过${logback.file.maxFileSize}时，需要进行日志滚动，该滚动文件被命名为`${log_path}/${app_name}_trace-info-%d{yyyyMMdd}-%i.log`；当日期变化时，那么也会进行日志滚动。总的滚动文件数不能超过${logback.file.maxHistory}，多了的话旧的滚动文件会被删除；总的日志文件大小不能超过${logback.file.totalSizeCap}，同样，多了的话旧的滚动文件也会被删除。







