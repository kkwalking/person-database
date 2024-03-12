import { sidebar } from "vuepress-theme-hope";

export default sidebar({
  "/": [
    {
      text: "开发",
      icon: "book",
      collapsible: false,
      prefix: "java/",
      children: ["deadlock", "about-singleton-pattern","dif-between-transactionlog-and-programlog",  "logback-custom-log-formattion"],
    },
    {
      text: "博客",
      icon: "blog",
      collapsible: false,
      prefix: "blog/",
      children: ["hexo-next"],
    },
    {
      text: "Redis",
      icon: "redis",
      collapsible: false,
      // prefix: "redis/",
      children: ["middleware/redis/redis-learn-string", "middleware/redis/redis-learn-list"],
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
