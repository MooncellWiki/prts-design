/**
 * 组件注册表：文档站侧栏 / 组件总览 / 组件页头（实现状态、源码、Storybook、现网模板）都从这里读。
 * 一个组件 = 一份 CSS 实现（packages/css/src/ 下，MW 模板 / Lua 输出的 HTML 用它）+ 可选的 Vue 实现（packages/vue/src/components/，prts-widgets 用它）。
 * 新增组件：在 entries/<分组>.ts 里加一条（按领域分文件，并行编辑互不冲突），写 site/<group>/<id>.md（或 <id>/index.md + guidelines.md / accessibility.md 两个页签）。
 */
import display from "./entries/display";
import feedback from "./entries/feedback";
import navigation from "./entries/navigation";
import form from "./entries/form";
import operator from "./entries/operator";
import skill from "./entries/skill";
import profile from "./entries/profile";
import world from "./entries/world";
export type Status = "ready" | "experimental" | "deprecated" | "planned";

export interface ComponentEntry {
  id: string;
  group: "components" | "arknights";
  /** 英文名（Storybook 标题、组件名） */
  name: string;
  /** 中文名 */
  zh: string;
  /** 一句话 */
  description: string;
  /** CSS 实现：packages/css/src/ 下的文件（可多个）+ 状态 */
  css: { files: string[]; status: Status };
  /** Vue 实现：packages/vue/src/components/<dir>/ 下的组件 + 状态 */
  vue?: { dir: string; components: string[]; status: Status };
  /** Storybook 标题前缀（Components/Button → components-button） */
  storybook?: string;
  /** 对应的现网模板 / Widget */
  template?: string;
}

export const components: ComponentEntry[] = [
  {
    id: "button",
    group: "components",
    name: "Button",
    zh: "按钮",
    description: "触发一个动作。主动作一处只放一枚；黑白反转的 contrast 对应游戏内 btn_on。",
    css: { files: ["components/button.css"], status: "ready" },
    vue: { dir: "Button", components: ["AkButton", "AkButtonGroup"], status: "experimental" },
    storybook: "components-button",
  },
  {
    id: "tag",
    group: "components",
    name: "Tag",
    zh: "标签",
    description: "短小的分类 / 状态标记。状态色走淡底色字，NEW / BREAKING 是仅有的红底。",
    css: { files: ["components/tag.css"], status: "ready" },
    vue: { dir: "Tag", components: ["AkTag"], status: "experimental" },
    storybook: "components-tag",
  },
  {
    id: "cbox",
    group: "components",
    name: "Cbox",
    zh: "正文提示框",
    description: "编辑写在正文里的提示——「另见」「已删除仅作存档」「剧透」。= 现网 {{Cbox2}}。",
    css: { files: ["components/cbox.css"], status: "ready" },
    vue: { dir: "Cbox", components: ["AkCbox"], status: "experimental" },
    storybook: "components-cbox",
    template: "Template:Cbox2",
  },
  {
    id: "tabs",
    group: "components",
    name: "Tabs",
    zh: "标签页",
    description: "同一位置切换几组平级内容。下划线 / 胶囊 / 游戏内块状 / 竖排四种外观。",
    css: { files: ["components/tabs.css"], status: "ready" },
    vue: { dir: "Tabs", components: ["AkTabs", "AkTabPane", "AkTab"], status: "experimental" },
    storybook: "components-tabs",
  },
  {
    id: "item",
    group: "arknights",
    name: "Item",
    zh: "道具",
    description: "游戏道具图标原样：现网拼好的合成图 + 骑在框沿上的描边数量。",
    css: { files: ["arknights/item.css", "arknights/materials.css"], status: "ready" },
    vue: { dir: "Item", components: ["AkItem", "AkItemList"], status: "experimental" },
    storybook: "arknights-item",
    template: "Template:道具图标",
  },
  ...display,
  ...feedback,
  ...navigation,
  ...form,
  ...operator,
  ...skill,
  ...profile,
  ...world,
];

export const STATUS_LABEL: Record<Status, string> = { ready: "可用", experimental: "实验", deprecated: "弃用", planned: "规划" };

export const GROUP_LABEL: Record<ComponentEntry["group"], string> = { components: "通用组件", arknights: "方舟组件" };

export const REPO = "https://github.com/MooncellWiki/prts-design";
