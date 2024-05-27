---
title: OkHttp开启线程池复用连接导致的EOFException解决方案
date: 2024-05-27
tag: 
  - Java
  - OkHttp
---
::: tip 拉个Star
- 如果<a href='https://github.com/kkwalking/person-database' target='blank'>本知识库</a>的内容帮助到你，还请点个免费的Star，感谢。传送门：<a href='https://github.com/kkwalking/person-database' target='blank'>GitHub</a>
:::

使用OkHttp来进行http调用，通常会使用池化机制。大家都知道，Http是基于TCP的，而TCP是面向连接的。TCP链接的建立需要经历三次握手，TCP链接的释放需要经过四次挥手。因而，连接的建立比较耗费时间和资源。所以通常会将这些链接进行复用，表现在Http层面就是使用Connection:keep-alive，再在代码中将这些已经建立的连接保存起来，后续如果是同一个主机地址的便可以复用。这就是OKHttp的连接池机制。

最近在Spring Boot项目中，我也是用了OkHttp来发送http请求调用，并配置了一个连接池。代码如下：

```java
@Configuration
public class OkHttpConfig {
    @Bean  
    public ConnectionPool pool() {  
        return new ConnectionPool(  
        20, 5L, TimeUnit.MINUTES);  
    }

    @Bean  
    public OkHttpClient okHttpClient() {  
        return new OkHttpClient.Builder()  
        .sslSocketFactory(sslSocketFactory(), x509TrustManager())  
        // 配置连接池,复用connection  
        .connectionPool(pool())  
        .connectTimeout(30L, TimeUnit.SECONDS)  
        .readTimeout(30L, TimeUnit.SECONDS)  
        .writeTimeout(30L,TimeUnit.SECONDS)  
        .retryOnConnectionFailure(false)  
        .build();  
	}
}


```

然而在使用项目过程中，发现时不时请求会出现失败，方便大家搜索到，我把异常结果放上来：

```java
java.io.IOException: unexpected end of stream on http://xxx.xxx/api/...
	at okhttp3.internal.http1.Http1ExchangeCodec.readResponseHeaders(Http1ExchangeCodec.kt:202)
	at okhttp3.internal.connection.Exchange.readResponseHeaders(Exchange.kt:106)
	at okhttp3.internal.http.CallServerInterceptor.intercept(CallServerInterceptor.kt:79)
	at okhttp3.internal.http.RealInterceptorChain.proceed(RealInterceptorChain.kt:109)
	at okhttp3.internal.connection.ConnectInterceptor.intercept(ConnectInterceptor.kt:34)
	at okhttp3.internal.http.RealInterceptorChain.proceed(RealInterceptorChain.kt:109)
	at okhttp3.internal.cache.CacheInterceptor.intercept(CacheInterceptor.kt:95)
	at okhttp3.internal.http.RealInterceptorChain.proceed(RealInterceptorChain.kt:109)
	at okhttp3.internal.http.BridgeInterceptor.intercept(BridgeInterceptor.kt:83)
	at okhttp3.internal.http.RealInterceptorChain.proceed(RealInterceptorChain.kt:109)
	at okhttp3.internal.http.RetryAndFollowUpInterceptor.intercept(RetryAndFollowUpInterceptor.kt:76)
	at okhttp3.internal.http.RealInterceptorChain.proceed(RealInterceptorChain.kt:109)
	at okhttp3.internal.connection.RealCall.getResponseWithInterceptorChain$okhttp(RealCall.kt:201)
	at okhttp3.internal.connection.RealCall.execute(RealCall.kt:154)
	at com.eshore.quanmeiti.gateway.service.impl.OkHttpService.execute(OkHttpService.java:194)
	at com.eshore.quanmeiti.gateway.service.impl.OkHttpService.doGet(OkHttpService.java:71)
	at com.eshore.quanmeiti.gateway.common.pool.GatewayTask.run(GatewayTask.java:73)
	at java.base/java.util.concurrent.ThreadPoolExecutor.runWorker(ThreadPoolExecutor.java:1128)
	at java.base/java.util.concurrent.ThreadPoolExecutor$Worker.run(ThreadPoolExecutor.java:628)
	at java.base/java.lang.Thread.run(Thread.java:834)
Caused by: java.io.EOFException: \n not found: limit=0 content=…
	at okio.RealBufferedSource.readUtf8LineStrict(RealBufferedSource.kt:332)
	at okhttp3.internal.http1.HeadersReader.readLine(HeadersReader.kt:29)
	at okhttp3.internal.http1.Http1ExchangeCodec.readResponseHeaders(Http1ExchangeCodec.kt:178)
	... 19 more
```

在stackoverflow上查到了原因，大概就是服务端端(相对来说我们是客户端)没有正确处理`Connection:keep-alive`长连接。服务端那边异常关闭了这条TCP连接，导致了我们这边请求就出错了。

解决方案有两种。

第一种：那我们不用长连接了，发送请求的时候主动添加上请求头`Connection:close`, 一条连接就变成一次性的，发完请求就关闭。

一开始我用的这种方案，问题是解决了。后面转念一想，那我的连接池就废了呀，每次请求完都把连接释放掉，下次请求就要重新建立一条连接，连接池的作用就无了。

因此，后面我采用了第二种方案。

第二种方案：将OKHttpClient的一项配置retryOnConnectionFailure设置为true。该配置的意思是启用连接失败重试。

代码如下: 

```java
    @Bean  
    public OkHttpClient okHttpClient() {  
        return new OkHttpClient.Builder()  
        .sslSocketFactory(sslSocketFactory(), x509TrustManager())  
        // 配置连接池,复用connection  
        .connectionPool(pool())  
        .connectTimeout(30L, TimeUnit.SECONDS)  
        .readTimeout(30L, TimeUnit.SECONDS)  
        .writeTimeout(30L,TimeUnit.SECONDS)  
        .retryOnConnectionFailure(true)  
        .build();  
	}
```

其实该配置是默认启用的，奈何我一开始配置的时候主动给关闭了 :)

配置之后，我们还是能用启用长连接，因此启用连接池是有意义的。当偶尔出现由于服务端错误关闭该TCP连接时，OkHttp便会重试，重新建立一条新的TCP连接来复用。