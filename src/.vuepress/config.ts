import { defineUserConfig } from "vuepress";
import theme from "./theme.js";

export default defineUserConfig({
  base: "/",

  lang: "zh-CN",
  title: "zzk的个人知识库",
  description: "欢迎来到zzk的个人知识库",

  theme,

  // 和 PWA 一起启用
  // shouldPrefetch: false,
});
