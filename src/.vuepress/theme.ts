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
  iconAssets: "//at.alicdn.com/t/c/font_2922463_o9q9dxmps9.css",

  logo: "/logo.svg",

  repo: "shzyjbr/person-database",
  pure: true,

  docsDir: "src",

  breadcrumb: true,

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
  contributors: false,
  lastUpdated: false,

  // 如果想要实时查看任何改变，启用它。注: 这对更新性能有很大负面影响
  // hotReload: true,

  // 在这里配置主题提供的插件
  plugins: {
    docsearch: {
      apiKey: "72b71c7a6cfd11cf122b87b36a921d51",
      indexName: "person-database",
      appId: "LC632VGWQG",
      locales: { 
        "/": {
          placeholder: "搜索文档",
          translations: {
            button: {
              buttonText: "搜索文档",
              buttonAriaLabel: "搜索文档",
            },
            modal: {
              searchBox: {
                resetButtonTitle: "清除查询条件",
                resetButtonAriaLabel: "清除查询条件",
                cancelButtonText: "取消",
                cancelButtonAriaLabel: "取消",
              },
              startScreen: {
                recentSearchesTitle: "搜索历史",
                noRecentSearchesText: "没有搜索历史",
                saveRecentSearchButtonTitle: "保存至搜索历史",
                removeRecentSearchButtonTitle: "从搜索历史中移除",
                favoriteSearchesTitle: "收藏",
                removeFavoriteSearchButtonTitle: "从收藏中移除",
              },
              errorScreen: {
                titleText: "无法获取结果",
                helpText: "你可能需要检查你的网络连接",
              },
              footer: {
                selectText: "选择",
                navigateText: "切换",
                closeText: "关闭",
                searchByText: "搜索提供者",
              },
              noResultsScreen: {
                noResultsText: "无法找到相关结果",
                suggestedQueryText: "你可以尝试查询",
                reportMissingResultsText: "你认为该查询应该有结果？",
                reportMissingResultsLinkText: "点击反馈",
              },
            },
          },
        },
      }
    },

    blog: true,

    // 在启用之前需要安装 @waline/client
    // 警告: 这是一个仅供演示的测试服务器，在生产环境中请自行部署并使用自己的服务器！
    // comment: {
    //   provider: "Waline",
    //   serverURL: "https://waline-comment.vuejs.press",
    // },

    feed: {
      rss: true
    },

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
