---
title: hexo搭建个人博客+NexT主题
date: 2020-11-27
tag: 
  - 博客搭建
---
::: tip 拉个Star
- 如果<a href='https://github.com/shzyjbr/person-database' target='blank'>本知识库</a>的内容帮助到你，还请点个免费的Star，感谢。传送门：<a href='https://github.com/shzyjbr/person-database' target='blank'>GitHub</a>
:::
### 1 hexo简介

> Hexo 是一个快速、简洁且高效的博客框架。Hexo 使用 [Markdown](http://daringfireball.net/projects/markdown/)（或其他渲染引擎）解析文章，生成静态网页。   --[Hexo](https://hexo.io/zh-cn/)官网

### 2 hexo安装

安装hexo需要先安装node.js和Git

#### 2.1 安装node.js

> Node.js 版本需不低于 10.13，建议使用 Node.js 12.0 及以上版本

通过node.js官网下载安装版进行安装，选择14.15.1长期支持版 官网：[Node.js](https://nodejs.org/zh-cn/)

![image-20201127135412872.png](https://i.loli.net/2020/11/27/Eym3zR8bX1FpcxT.png)

安装过程与普通软件安装没有差别，一路next。

#### 2.2 安装Git

通过Git官网下载Git安装版进行安装，安装版本2.29.2 官网：[Git (git-scm.com)](https://git-scm.com/)

![git.png](https://i.loli.net/2020/11/27/Dew6M4naP5Aucby.png)

#### 2.3 正式安装hexo

安装好node.js和Git之后就可以开始进行hexo的安装

```
npm install -g hexo-cli
```

安装成功之后可以在cmd命令行中输入hexo，查看是否安装成功

![image-20201127140007483](https://i.loli.net/2020/11/27/P4Mktm3IlERVxoC.png)

出现如下提示则表示安装成功。

### 3 使用hexo搭建博客

#### 3.1 初始化

在Windows中创建一个文件夹，作为想要搭建的博客的根目录，比如我的就是 D:\blog\hexo

**在cmd中进入根目录下**，使用如下命令初始化，该命令会在根目录下创建hexo所需的文件

```
hexo init
```

创建完成之后的目录如下所示：

```
.
├── _config.yml
├── package.json
├── scaffolds
├── source
|   ├── _drafts
|   └── _posts
└── themes
```

其中\_config.yml称为站点配置文件，对应的，themes/\_config.yml称为主题配置文件。
简单解释下两个配置文件。根目录下的\_config.yml是对整个博客站点的内容进行设置。hexo的博客可以指定多种主题，主题的配置是通过themes/\_config.yml进行设置的。

#### 3.2 启动hexo

使用如下命令可以启动hexo，进行快速效果预览。

```
hexo server
```

可以看到出现如下提示：

![image-20201127141157314.png](https://i.loli.net/2020/11/27/qUmerCBi3Wcf6aF.png))

浏览器访问localhost:4000可以看到博客搭建成功。

![image-20201127141428928.png](https://i.loli.net/2020/11/27/w5hLyImDjSJio1k.png)

### 4. 使用NexT主题

hexo可以通过指定不同的主题，达到更换博客风格的目的。hexo的主题可以访问[Themes | Hexo](https://hexo.io/themes/)

本次选用Text主题。

#### 4.1 下载NexT主题

我们通过Git来下载。

**在cmd目录下进入根目录**，使用如下命令。

```
git clone https://github.com/iissnan/hexo-theme-next themes/next
```

下载完毕后可以看到themes目录下多了一个next文件夹

*hexo把所有的主题都放在了themes文件夹里面，所以通常的做法就是把想要使用的主题放到在themes目录下面，之后去站点配置文件里面进行主题的设置。*

#### 4.2 设置站点配置文件，进行主题更换

打开站点配置文件_config.yml,  可以使用查找功能定位到themes关键字，修改为如下：

```
theme: next
```

#### 4.3 启动博客进行验证

输入`hexo server`启动博客，可以看到主题已经更换为NexT主题。

*下图的NexT主题经过了其他设置，所以你的主题可能和我看起来有点不一样*

![image-20201127145135433.png](https://i.loli.net/2020/11/27/TO42oeM7bp8xQ6y.png)