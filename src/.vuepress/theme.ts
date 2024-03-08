import { hopeTheme } from "vuepress-theme-hope";
import navbar from "./navbar.js";
import sidebar from "./sidebar.js";

export default hopeTheme({
  hostname: "https://shzyjbr.github.com/person-database",
  // hostname: "http://localhost:8080/person-database",

  author: {
    name: "zzk",
    url: "https://github.com/shzyjbr",
  },

  favicon: "/favicon.ico",

  // iconAssets: "fontawesome-with-brands",

  logo: "http://zzk31.320.io/img/logo.svg",

  repo: "shzyjbr/person-database",

  docsDir: "src",

  breadcrumb: false,

  // 导航栏
  navbar,

  // 侧边栏
  sidebar,

  // 页脚
  footer: "等我放点东西在这",
  displayFooter: true,

  // 博客相关
  blog: {
    description: "一个普通的后端开发",
    intro: "/intro.html",
    medias: {
      GitHub: "https://github.com/shzyjbr",
      Email: "mailto://417160807@qq.com"
    },
  },

  // 加密配置
  encrypt: {
    config: {
      // "/about-the-author/self-introduction.html": ["1234"],
    },
  },

  // 多语言配置
  metaLocales: {
    editLink: "编辑此页",
  },

  editLink: false,

  // 如果想要实时查看任何改变，启用它。注: 这对更新性能有很大负面影响
  // hotReload: true,

  // 在这里配置主题提供的插件
  plugins: {
    searchPro: true,

    blog: true,

    // 在启用之前需要安装 @waline/client
    // 警告: 这是一个仅供演示的测试服务器，在生产环境中请自行部署并使用自己的服务器！
    // comment: {
    //   provider: "Waline",
    //   serverURL: "https://waline-comment.vuejs.press",
    // },

    feed: true,

    components: {
      components: ["Badge", "VPCard"],
    },

    // 此处开启了很多功能用于演示，你应仅保留用到的功能。
    mdEnhance: {
      align: true,
      attrs: true,
      codetabs: true,
      component: true,
      demo: false,
      figure: true,
      imgLazyload: true,
      imgSize: true,
      include: true,
      mark: true,
      stylize: [
        {
          matcher: "Recommended",
          replacer: ({ tag }) => {
            if (tag === "em")
              return {
                tag: "Badge",
                attrs: { type: "tip" },
                content: "Recommended",
              };
          },
        },
      ],
      sub: true,
      sup: true,
      tabs: true,
      vPre: true,

    },
  },
});
