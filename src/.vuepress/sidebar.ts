import { sidebar } from "vuepress-theme-hope";

export default sidebar({
  "/": [
    {
      text: "Java",
      icon: "book",
      collapsible: false,
      prefix: "java/",
      children: ["deadlock", "dif-between-transactionlog-and-programlog", "about-singleton-pattern"],
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


});
