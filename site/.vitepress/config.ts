/**
 * AKDS 文档站（≈ primer.style）：VitePress。
 *   pnpm dev:docs          开发
 *   pnpm build:docs    → site/.vitepress/dist（Pages 站点根目录；scripts/build-site.sh 再并上 /storybook/ 与 /dist/）
 * 组件示例在 iframe 里跑 AKDS 全套样式（见 theme/components/Demo.vue），文档站自己的外观只借令牌。
 */
import { existsSync } from "node:fs";
import { resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { defineConfigWithTheme, type DefaultTheme } from "vitepress";

import { akdsMeta } from "./plugins/meta";
import { demoPlugin } from "./plugins/demo";
import { components, GROUP_LABEL, REPO, type ComponentEntry } from "./registry";

const site = resolve(import.meta.dirname, "..");
const base = process.env.AKDS_BASE ?? "/";

/** 组件页：<group>/<id>.md 或 <group>/<id>/index.md（有指南 / 可访问性页签时用目录） */
const componentLink = (c: ComponentEntry) => (existsSync(resolve(site, c.group, c.id, "index.md")) ? `/${c.group}/${c.id}/` : `/${c.group}/${c.id}`);

/** 每个组件有哪几个页签（概览 / 指南 / 可访问性）：看 <group>/<id>/ 下有哪些文件 */
const TABS = ["index", "guidelines", "accessibility"];
const akdsTabs = Object.fromEntries(components.map(c => [c.id, TABS.filter(t => existsSync(resolve(site, c.group, c.id, `${t}.md`)))]));

const groupItems = (g: ComponentEntry["group"]): DefaultTheme.SidebarItem[] =>
  components
    .filter(c => c.group === g)
    .sort((a, b) => a.name.localeCompare(b.name))
    .map(c => ({ text: `${c.zh} ${c.name}`, link: componentLink(c) }));

const sidebar: DefaultTheme.Sidebar = [
  {
    text: "入门",
    items: [
      { text: "介绍", link: "/guide/" },
      {
        text: "在 MediaWiki 中使用",
        link: "/guide/mediawiki",
        collapsed: false,
        items: [
          { text: "模块与层序", link: "/guide/resourceloader" },
          { text: "skin.mustache 结构", link: "/guide/skin-template" },
          { text: "模板与 TemplateStyles", link: "/guide/templates" },
          { text: "迁移与上线", link: "/guide/rollout" },
        ],
      },
      { text: "在 Vue / prts-widgets 中使用", link: "/guide/vue" },
      { text: "贡献一个组件", link: "/guide/contributing" },
    ],
  },
  {
    text: "基础",
    items: [
      { text: "设计理念", link: "/foundations/principles" },
      { text: "色彩", link: "/foundations/color" },
      { text: "字体排印", link: "/foundations/typography" },
      { text: "尺寸 / 动效 / 层级", link: "/foundations/size" },
      { text: "装饰语言", link: "/foundations/decoration" },
      { text: "图标", link: "/foundations/icons" },
      { text: "可访问性", link: "/foundations/accessibility" },
    ],
  },
  // L1：给 wikitext / MW 核心输出换肤（纯 CSS，packages/css/src/base/）；L2：正文之外的皮肤骨架（packages/css/src/chrome/）
  {
    text: "MediaWiki 内容样式",
    collapsed: false,
    items: [
      { text: "概述", link: "/content/" },
      { text: "排版", link: "/content/typography" },
      { text: "表格", link: "/content/tables" },
      { text: "缩略图与图库", link: "/content/media" },
      { text: "目录 · 折叠 · 引用", link: "/content/toc" },
      { text: "消息框", link: "/content/notices" },
      { text: "TabberNeue", link: "/content/tabber" },
      { text: "分类栏与杂项", link: "/content/catlinks" },
      { text: "表单控件", link: "/content/forms" },
      { text: "特殊页面", link: "/content/special-pages" },
    ],
  },
  {
    text: "皮肤骨架",
    collapsed: false,
    items: [
      { text: "概述", link: "/chrome/" },
      { text: "页眉", link: "/chrome/header" },
      { text: "头图与主题接口", link: "/chrome/theming" },
      { text: "侧栏", link: "/chrome/sidebar" },
      { text: "页面头", link: "/chrome/page-header" },
      { text: "目录", link: "/chrome/toc" },
      { text: "页脚", link: "/chrome/footer" },
      { text: "搜索面板", link: "/chrome/search" },
      { text: "响应式", link: "/chrome/responsive" },
    ],
  },
  { text: GROUP_LABEL.components, items: [{ text: "总览", link: "/components/" }, ...groupItems("components")] },
  { text: GROUP_LABEL.arknights, items: groupItems("arknights") },
  {
    text: "整页样例",
    items: [
      { text: "概述", link: "/patterns/" },
      { text: "首页设计稿", link: "/patterns/home" },
      { text: "干员页（陈）", link: "/patterns/operator" },
    ],
  },
];

export default defineConfigWithTheme<DefaultTheme.Config & { akdsTabs: Record<string, string[]> }>({
  lang: "zh-CN",
  title: "AKDS",
  titleTemplate: ":title · AKDS 明日方舟网页设计系统",
  description: "AKDS · 明日方舟网页设计系统（prts.wiki 新皮肤）——令牌 / CSS / Vue 三层实现",
  base,
  srcDir: ".",
  srcExclude: ["public/**"], // public/preview、public/src 是指向仓库的链接，里面的 NOTICE.md 不是页面
  assetsDir: "_vp", // 站点根目录的 assets/ 让给预览素材
  cleanUrls: true,
  lastUpdated: false,
  appearance: "dark", // 与预览站一致：默认终端（暗）
  // 指向仓库文件的相对链接（../x.css 之类）与 .css / .js / .html 等文件链接不是站点页面，不查
  ignoreDeadLinks: [/^\.\.?\//, /\.(css|js|py|sh|json|html)$/],
  head: [
    ["meta", { name: "referrer", content: "no-referrer" }], // 干员页样例从 static.prts.wiki 拉 Widget 资源，那边防盗链
    // AKDS 令牌按 html[data-theme] 切明暗；VitePress 的外观开关只打 .dark——首屏前同步一次，避免闪
    [
      "script",
      {},
      `(()=>{try{var s=localStorage.getItem("vitepress-theme-appearance")||"dark";var d=s==="dark"||(s==="auto"&&matchMedia("(prefers-color-scheme: dark)").matches);document.documentElement.setAttribute("data-theme",d?"dark":"light")}catch(e){}})()`,
    ],
  ],
  markdown: {
    config: md => demoPlugin(md),
  },
  themeConfig: {
    logo: { src: "/preview/assets/camp/rhodes.png", alt: "" },
    siteTitle: "AKDS",
    nav: [
      { text: "基础", link: "/foundations/principles", activeMatch: "^/foundations/" },
      {
        text: "皮肤",
        activeMatch: "^/(content|chrome)/",
        items: [
          { text: "MediaWiki 内容样式", link: "/content/", activeMatch: "^/content/" },
          { text: "皮肤骨架", link: "/chrome/", activeMatch: "^/chrome/" },
        ],
      },
      { text: "组件", link: "/components/", activeMatch: "^/(components|arknights)/" },
      { text: "整页样例", link: "/patterns/home", activeMatch: "^/patterns/" },
      // 站内路径由 VitePress 自己补 base；target 让路由器不接管（否则当成文档页走 404）
      { text: "Storybook", link: process.env.NODE_ENV === "production" ? "/storybook/" : "http://localhost:6006/", target: "_blank" },
    ],
    sidebar,
    akdsTabs,
    outline: { level: [2, 3], label: "本页目录" },
    socialLinks: [{ icon: "github", link: REPO }],
    search: {
      provider: "local",
      options: {
        translations: {
          button: { buttonText: "搜索", buttonAriaLabel: "搜索" },
          modal: {
            displayDetails: "显示详情",
            resetButtonTitle: "清除",
            backButtonTitle: "关闭",
            noResultsText: "没有找到",
            footer: { selectText: "选择", navigateText: "切换", closeText: "关闭" },
          },
        },
      },
    },
    docFooter: { prev: "上一页", next: "下一页" },
    darkModeSwitchLabel: "外观",
    lightModeSwitchTitle: "切换到档案模式（亮）",
    darkModeSwitchTitle: "切换到终端模式（暗）",
    sidebarMenuLabel: "菜单",
    returnToTopLabel: "回到顶部",
    footer: { message: "文本 CC BY-NC-SA 4.0 · 游戏素材版权归鹰角网络所有", copyright: "PRTS.wiki · AKDS" },
  },
  vite: {
    plugins: [akdsMeta()],
    resolve: { alias: { "@mooncellwiki/akds-vue": fileURLToPath(new URL("../../packages/vue/src/index.ts", import.meta.url)) } },
    server: { fs: { allow: [resolve(site, "..")] } },
  },
});
