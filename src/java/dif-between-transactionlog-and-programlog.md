---
title: 【后端开发】项目日志建设之流水日志和程序日志的区分
category: 项目实践
date: 2024-03-08
tag:
  - 日志
---
# 项目日志建设之流水日志和程序日志的区分

最近项目要求对程序日志进行两类区分，将日志大体记录为流水日志和程序日志。

所谓流水日志，更详细的说是请求响应流水日志，记录的是系统执行的web请求、响应的内容。其主要方面一般包括后端接口调用、后端调用其他服务接口的请求与响应日志。如果项目有对外向其他系统暴露服务，那么还需要包括其他服务调用本系统接口的请求响应日志。

而程序日志则是我们原来熟知的在程序中记录的一些常规日志，如记录异常请求处理、运行中一些助于排查的信息记录等，可以说是除了流水日志外的其他日志。

另一方面，在区分流水日志和程序日志的基础上，还希望将debug、info、warn、error等不同级别的日志写入不同的日志文件中，方便查看。

## 如何去做这样的一个日志区分呢？

在动手编写日志配置文件之前，我们可以大概设想一下我们需要的日志文件结构。举个例子，按照以上要求，对于流水日志，我们需要内容为流水类型且日志级别为info的日志文件，..., 内容为流水类型且日志级别为error的日志文件。为方便后续描述，我们可以将流水用transaction表示，程序用program表示。日志命名格式上，我们可以采用`项目名_日志类型-日志级别-日期.log`来命名。举个例子，有一个项目名为xxx-gateway，那么这个项目在2023年8月29日这天的info级别的流水日志，可以命名为`xxx-gateway_transaction-info-2023-08-29.log`，同理还有`xxx-gateway_transaction-debug-2023-08-29.log`、`xxx-gateway_transaction-warn-2023-08-29.log`和`xxx-gateway_transaction-error-2023-08-29.log`。对于程序日志则有`xxx-gateway_program-info-2023-08-29.log`、`xxx-gateway_program-warn-2023-08-29.log`等，其他不再列举。
总结一下，假设日志目录为logs，文件结构如下:

```C
-logs
    - xxx-gateway_transaction-debug-2023-08-29.log
    - xxx-gateway_transaction-info-2023-08-29.log
    - xxx-gateway_transaction-warn-2023-08-29.log
    - xxx-gateway_transaction-error-2023-08-29.log
    - xxx-gateway_program-error-2023-08-29.log
    - xxx-gateway_program-info-2023-08-29.log
    - xxx-gateway_program-warn-2023-08-29.log
    - xxx-gateway_program-error-2023-08-29.log
```

本文采用的日志框架是logback，在Spring Boot项目中搭配使用。

## 具体做法

### 1. 定义appender

根据以上思路，我们需要在logback配置文件（本文是logback-spring.xml）中配置八个appender来实现向上述八个不同日志文件写入不同日志级别的日志记录。

以写入`xxx-gateway_transaction-info-2023-08-29.log`的appender为例，我们拆解一下这样一个appender需要什么配置，相关的注释我都标注在代码上了

```xml
    <appender name="TRANSACTION_INFO_FILE" class="ch.qos.logback.core.rolling.RollingFileAppender">
        <!-- 正在记录的日志文档的路径及文档名 -->
        <file>${LOG_HOME}/${APP_NAME}_transaction-info.log</file>
        <!--日志文档输出格式-->
        <encoder class="ch.qos.logback.core.encoder.LayoutWrappingEncoder">
            <layout class="com.xxx.gateway.log.layout.TransactionLayout">
                <appName>${APP_NAME}_info</appName>
            </layout>
            <charset>UTF-8</charset> <!-- 设置字符集 -->
        </encoder>
        <!-- 日志记录器的滚动策略，按日期，按大小记录 -->
        <rollingPolicy class="ch.qos.logback.core.rolling.TimeBasedRollingPolicy">
            <!-- 每天日志归档路径以及格式 -->
            <fileNamePattern>${LOG_HOME}/${APP_NAME}-info-%d{yyyy-MM-dd}.%i.log</fileNamePattern>
            <timeBasedFileNamingAndTriggeringPolicy class="ch.qos.logback.core.rolling.SizeAndTimeBasedFNATP">
                <maxFileSize>1024MB</maxFileSize>
            </timeBasedFileNamingAndTriggeringPolicy>
            <!--日志文档保留天数-->
            <maxHistory>2</maxHistory>
        </rollingPolicy>
        <!-- 此日志文档只记录info级别的 -->
        <filter class="ch.qos.logback.classic.filter.LevelFilter">
            <level>info</level>
            <onMatch>ACCEPT</onMatch>
            <onMismatch>DENY</onMismatch>
        </filter>
    </appender>
```

`<appender>`:我将这个appender命名为TRANSACTION_INFO_FILE，表示它是用来写入请求响应流水日志且为info级别的日志文件。class选择logback提供的一个类，该类可以进行日志文件的滚动更新。所谓滚动更新用大白话解释就是，怎么分割归档文件。主要看`<rollingPolicy>`中的配置,当前例子是%d{yyyy-MM-dd}，也就是按不同的日期进行归档（%i作用是当文件大小太大则按1024MB分割出文件进行标号）

`<File>`标签中的${LOG_HOME}这些都是自定义的变量，比如我的项目的LOG_HOME就是logs，${APP_NAME}就是项目名称，比如在这里就是xxx-gateway，因此组合起来的文件命名格式就是上文描述的格式。

`<encoder>`用来自定义一条日志打印的具体格式，在这里不再展开，这里有我写的一篇关于自定义日志格式的文章:<a href='./logback-custom-log-formattion' target='blank'>logback自定义日志格式，以json格式为例</a>，可以参考。

`<rollingPolicy>`标签使用到logback提供的TimeBasedRollingPolicy，这意味着日志文件将根据大小和时间限制进行滚动。`<fileNamePattern>`指定滚动的时候文件名的格式，`<timeBasedFileNamingAndTriggeringPolicy>`用于控制日志文件大小到达某一阈值需要进行切分。`<maxHistory>`用于控制归档的日志留存的时长，单位是天。

`<filter>`表达的意义是这是一个只接受INFO级别日志事件的级别筛选器。对于任何非INFO级别的日志事件都将被拒绝。

因此，这个appender做的事情就是，定义了请求响应流水日志且日志级别为info的日志要输出到`${LOG_HOME}/${APP_NAME}_transaction-info.log`这个文件中。滚动策略是先根据日期将日志记录到不同的文件中，然后根据文件大小滚动每个日期的日志文件。这样可以实现按天滚动的基础上，再根据文件大小进行滚动的效果。日志布局也就是日志的打印格式通过com.xxx.gateway.log.layout.TransactionLayout进行自定义。

按照以上做法，我们可以依葫芦画瓢，定义出另外7个appender。


### 2. 定义logger

logger称作日志记录器，用于定义某一日志记录器的行为
以下面这个root记录器为例
```xml
    <root level="info" additivity="false">
        <appender-ref ref="PROGRAM_INFO_FILE"/>
        <appender-ref ref="PROGRAM_WARN_FILE"/>
        <appender-ref ref="PROGRAM_ERROR_FILE"/>
        <appender-ref ref="STDOUT"/>
    </root>
```
- level: 指定root日志记录器的日志级别为"info"。这意味着root日志记录器将记录所有"info"级别及以上的日志消息，而低于"info"级别的消息将被忽略。注意！这里是info及以上！
- additivity: 是否启用日志事件的传播。如果设置为"false"，则root日志记录器的日志消息将只被发送到指定的appender，并不会传播到其他日志记录器。如果设置为"true"，则日志消息将传播给其他适用的日志记录器，也就是一条日志被root日志记录器消费掉了，独占。
- appender-ref: 引用了四个不同的appender，分别是"PROGRAM_INFO_FILE"、"PROGRAM_WARN_FILE"、"PROGRAM_ERROR_FILE"和"STDOUT"。这些引用定义了将日志消息发送到哪些appender进行记录。也就是一条消息会被发往这四个appender,这些appender会根据自己的配置去决定是否记录该日志。

以上这个日志记录器就可以作为我们项目中的程序日志记录器，通常我们在类中通过`private static Logger log = org.slf4j.LoggerFactory.getLogger(AnyExample.class);`定义出来的log对象就会使用到这个日志记录器，包括使用@Slf4j注解也一样。

而针对流水日志记录器，配置如下：
```xml

    <logger name="web_transaction_logger" additivity="false" level="info">
        <appender-ref ref="TRANSACTION_INFO_FILE"/>
        <appender-ref ref="TRANSACTION_WARN_FILE"/>
        <appender-ref ref="TRANSACTION_ERROR_FILE"/>
        <appender-ref ref="STDOUT"/>
    </logger>
```
该logger 多了一个名字，也就是"web_transaction_logger"。在代码中，当我们需要记录流水日志时，我们需要这样引用该logger:
```java
    static final Logger transactionlogger = LoggerFactory.getLogger("web_transaction_logger");
```
通过这种方式，我们将程序日志和流水日志进行了区分。
这种配置的一个好处是可以无侵入地在旧有项目上对程序日志和流水日志进行区分。原先代码中打日志的地方，我们都可以不做改动，默认作为程序日志，而针对web请求响应，我们可以在诸如filter等地方使用web_transaction_logger进行记录。






