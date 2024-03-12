import { sidebar } from "vuepress-theme-hope";

export default sidebar({
  "/": [
    {
      text: "Java",
      icon: "book",
      collapsible: false,
      prefix: "java/",
      children: ["deadlock", "dif-between-transactionlog-and-programlog", "about-singleton-pattern", "logback-custom-log-formattion"],
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
