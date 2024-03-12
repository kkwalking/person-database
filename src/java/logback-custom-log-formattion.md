---
title: 【后端开发】logback自定义日志格式，以json格式为例
date: 2024-03-12
tag: 
  - Java
  - 日志
  - logback
---
::: tip 拉个Star
- 如果<a href='https://github.com/shzyjbr/person-database' target='blank'>本知识库</a>的内容帮助到你，还请点个免费的Star，感谢。传送门：<a href='https://github.com/shzyjbr/person-database' target='blank'>GitHub</a>
:::
# 【后端开发】logback自定义日志格式，以json格式为例

## 一、背景

在项目开发中，我们有时候会遇到需要指定日志格式的场景，比如项目的日志接入了在线日志收集系统，该收集系统要求日志需要满足其指定的日志格式才会被收集。

接下来，我就以打印json格式的日志为例，向各位分享两种方案。

## 二、方案

### 2.1 方案1

通过指定encoder的具体类为net.logstash.logback.encoder.LoggingEventCompositeJsonEncoder类，在pattern中可以打印指定格式的日志。

pattern中的变量格式有三类。一类是logback自定义的诸如%level等，一类是如${app_name}这样我们定义在logback.xml中的properties。还有一类形如%X{variable_name}是通过在代码中设置进MDC变量的，关于MDC的使用本文就不展开了，感兴趣请自行搜索。

直接show出可用的logback配置代码，下面是一个appender的示例代码

```xml

    <appender name="your-appender-name" class="ch.qos.logback.core.rolling.RollingFileAppender">
        <File>${log_path}/${app_name}-${currentTime}.log</File>
        <append>true</append>
        <filter class="ch.qos.logback.classic.filter.LevelFilter">
            <level>INFO</level>
            <onMatch>ACCEPT</onMatch>
            <onMismatch>DENY</onMismatch>
        </filter>
        <rollingPolicy class="ch.qos.logback.core.rolling.SizeAndTimeBasedRollingPolicy">
            <fileNamePattern>${log_path}/${app_name}-%d{yyyyMMdd}-%i.log</fileNamePattern>
            <maxHistory>${logback.file.maxHistory}</maxHistory>
            <maxFileSize>${logback.file.maxFileSize}</maxFileSize>
            <totalSizeCap>${logback.file.totalSizeCap}</totalSizeCap>
        </rollingPolicy>
        
        <!-- 打印json格式，请重点看这里-->
        <encoder charset="UTF-8" class="net.logstash.logback.encoder.LoggingEventCompositeJsonEncoder">
            <providers>
                <pattern>
                    <pattern>
                         <!--下面定义出一个json格式的消息，仅做示例-->
                        <!--具体的信息格式请根据你的需求而定-->
                        {
                        "app_name": "${app_name}_info",
                        "level": "%level",
                        "log_time": "%date{\"yyyy-MM-dd HH:mm:ss.SSS\"}",
                        <!--   "logger": "%logger",  %logger打印logger名字， %class打印具体类名-->
                        "logger": "%class",
                        "transaction_id": "%X{transaction_id}",
                        "address": "%X{address}",
                        "response_headers": "%X{response_headers}",
                        "response_payload": "%X{response_payload}",
                        "response_code": "%X{response_code}"
                        }
                    </pattern>
                </pattern>
            </providers>
        </encoder>
    </appender>

```



### 2.2 方案2

另一种打印自定义格式的方法则是通过代码处理。

1. 首先，继承`ch.qos.logback.core.LayoutBase<ILoggingEvent>`，并重写doLayout(ILoggingEvent event)方法

```java
@Data
public class ProgramLayout extends LayoutBase<ILoggingEvent> {
    // 也可以自定义参数，后续可以在logback.xml中传入
    protected String appName;

    public ProgramLayout() {
    }

    /**
     * 覆盖该方法，可以定制需要的日志格式
     * @param event The event to format
     * @return
     */
    @Override
    public String doLayout(ILoggingEvent event) {
        ProgramLogParam params = new ProgramLogParam();
        params.setApp_name(this.appName);
        params.setLevel(event.getLevel().toString());
        params.setLogger(event.getLoggerName());
        params.setLog_time((new Timestamp(event.getTimeStamp())).toString());
        params.setTransaction_id(MDCUtil.getTransactionId());
        // 通过event.getFormattedMessage()就可以获取到源消息
        String message = event.getFormattedMessage();
        if (event.getThrowableProxy() != null) {
            ExtendedThrowableProxyConverter throwableConverter = new ExtendedThrowableProxyConverter();
            throwableConverter.start();
            message = event.getFormattedMessage() + "\n" + throwableConverter.convert(event);
            throwableConverter.stop();
        }

		// 如果打印的源日志消息就包含json格式的字符串，则截取该部分消息作为code_message
        int beginIndex = message.indexOf("{");
        int endIndex = message.lastIndexOf("}") + 1;
        if (beginIndex >= 0) {
            String jsonMsg = message.substring(beginIndex, endIndex);
            params.setCode_message(jsonMsg);
        } else {
            params.setCode_message(message);
        }
        return JSON.toJSONString(params) + CoreConstants.LINE_SEPARATOR;
    }
}
```

ProgramLogParam是个bean，我简单放一下，用了lombok的注解，方便查看

```java
@Data
public class ProgramLogParam {
    private String app_name;
    private String level;
    private String logger;
    private String log_time;
    private String code_message;
    private String transaction_id;
}
```

2. 在logback.xml在配置encoder的layout为该ProgramLayout，即可达到打印指定日志格式的目的。

```xml
 <appender name="TRANSACTION_INFO_FILE" class="ch.qos.logback.core.rolling.RollingFileAppender">
        <!-- 正在记录的日志文档的路径及文档名 -->
        <file>${LOG_HOME}/${APP_NAME}_info-info.log</file>
        <!--日志文档输出格式-->
        <encoder class="ch.qos.logback.core.encoder.LayoutWrappingEncoder">
            <layout class="com.demo.log.layout.TransactionLayout">
                <!--传入自定义参数-->
                <appName>${APP_NAME}</appName>
            </layout>
            <charset>UTF-8</charset>
        </encoder>
        <rollingPolicy class="ch.qos.logback.core.rolling.TimeBasedRollingPolicy">
            <fileNamePattern>${LOG_HOME}/${APP_NAME}-%d{yyyy-MM-dd}.%i.log</fileNamePattern>
            <timeBasedFileNamingAndTriggeringPolicy class="ch.qos.logback.core.rolling.SizeAndTimeBasedFNATP">
                <maxFileSize>1024MB</maxFileSize>
            </timeBasedFileNamingAndTriggeringPolicy>
            <maxHistory>2</maxHistory>
        </rollingPolicy>
        <filter class="ch.qos.logback.classic.filter.LevelFilter">
            <level>info</level>
            <onMatch>ACCEPT</onMatch>
            <onMismatch>DENY</onMismatch>
        </filter>
    </appender>
```

