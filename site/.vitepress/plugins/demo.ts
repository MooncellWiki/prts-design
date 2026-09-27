/**
 * 文档里的两种示例写法（都渲染成 <Demo>：iframe 里挂 AKDS 全套样式 + wiki 正文容器，与文档站自己的样式互不干扰）
 *
 *   @demo Button/Variants            独占一行：vue/src/components/Button/demos/Variants.vue——实时渲染；
 *                                     「Vue」页签 = 这个 SFC 的源码（构建期 Shiki 高亮），「HTML」页签 = 渲染出来的结构（运行时从 iframe 取）；
 *                                     Storybook 链接 = 注册表里的 storybook 前缀 + demo 名
 *   ```html demo                     纯 CSS 实现的示例（装饰语言 / MW 内容样式 / 还没有 Vue 版的组件）：代码块本身就是 HTML 页签
 *   ```html demo bare                不包 .mw-body-content.mw-parser-output（皮肤骨架那类不在正文里的）
 */
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import type { MarkdownRenderer } from "vitepress";

import { components } from "../registry";

const root = resolve(import.meta.dirname, "../../..");
const kebab = (s: string) => s.replace(/([a-z0-9])([A-Z])/g, "$1-$2").toLowerCase();

export function demoPlugin(md: MarkdownRenderer) {
  md.block.ruler.before("paragraph", "akds_demo", (state, startLine, _endLine, silent) => {
    const line = state.src.slice(state.bMarks[startLine] + state.tShift[startLine], state.eMarks[startLine]);
    const m = /^@demo\s+(\w+\/\w+)((?:\s+\w+)*)\s*$/.exec(line);
    if (!m) return false;
    if (silent) return true;
    const token = state.push("akds_demo", "", 0);
    token.info = m[1];
    token.meta = { flags: m[2].trim().split(/\s+/).filter(Boolean) };
    token.map = [startLine, startLine + 1];
    state.line = startLine + 1;
    return true;
  });

  const fence = md.renderer.rules.fence!;
  /** markdown-it 的 Token 类（StateCore.prototype.Token；vitepress 没把 markdown-it 暴露成可 import 的依赖） */
  type Token = Parameters<typeof fence>[0][number];
  const TokenClass = (md.core as unknown as { State: { prototype: { Token: new (type: string, tag: string, nesting: number) => Token } } }).State
    .prototype.Token;
  /** 借 VitePress 自己的代码块渲染（Shiki 高亮 + 复制按钮 + 语言标签） */
  const codeBlock = (code: string, lang: string, env: unknown) => {
    const t = new TokenClass("fence", "code", 0);
    t.info = lang;
    t.content = code.trimEnd() + "\n";
    t.markup = "```";
    return fence([t], 0, md.options, env, md.renderer);
  };

  md.renderer.rules.akds_demo = (tokens, idx, _opts, env) => {
    const src = tokens[idx].info;
    const flags: string[] = tokens[idx].meta.flags;
    const [dir, name] = src.split("/");
    const code = readFileSync(resolve(root, `vue/src/components/${dir}/demos/${name}.vue`), "utf8");
    const entry = components.find(c => c.vue?.dir === dir);
    const story = entry?.storybook ? `${entry.storybook}--${kebab(name)}` : "";
    const attrs = [`src="${src}"`, story && `story="${story}"`, flags.includes("bare") && "bare"].filter(Boolean).join(" ");
    return `<Demo ${attrs}>\n<template #vue>${codeBlock(code, "vue", env)}</template>\n</Demo>\n`;
  };

  md.renderer.rules.fence = (tokens, idx, opts, env, self) => {
    const t = tokens[idx];
    const m = /^html\s+demo((?:\s+\w+)*)\s*$/.exec(t.info);
    if (!m) return fence(tokens, idx, opts, env, self);
    const bare = m[1].includes("bare");
    return `<Demo html="${encodeURIComponent(t.content)}"${bare ? " bare" : ""}>\n<template #html>${codeBlock(t.content, "html", env)}</template>\n</Demo>\n`;
  };
}
