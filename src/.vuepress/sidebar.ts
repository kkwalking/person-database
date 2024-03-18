import { sidebar } from "vuepress-theme-hope";

export default sidebar({
  "/": [
    {
      text: "开发",
      icon: "java",
      collapsible: false,
      prefix: "java/",
      children: ["dif-between-transactionlog-and-programlog",  "logback-custom-log-formattion"],
    },
    {
      text: "Redis",
      icon: "redis",
      collapsible: false,
      // prefix: "redis/",
      children: ["middleware/redis/redis-learn-string", "middleware/redis/redis-learn-list"],
    },
    {
      text: "操作系统",
      icon: "caozuoxitong",
      collapsible: false,
      prefix: "operating-system/",
      children: ["deadlock"],
    },
    {
      text: "设计模式",
      icon: "design",
      collapsible: false,
      prefix: "pattern-design/",
      children: ["about-singleton-pattern"],
    },
    {
      text: "博客",
      icon: "project",
      collapsible: false,
      prefix: "blog/",
      children: ["hexo-next"],
    },

  ],
  "/life": [
    {
      text: "生活",
      icon: "book",
      collapsible: false,
      children: ["comeon"],
    },
  ],
  "/about-the-author": [
    {
      text: "作者",
      icon: "book",
      collapsible: false,
      children: ["self-introduction"],
    },
  ],


});
