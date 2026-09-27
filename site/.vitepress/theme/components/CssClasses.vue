<script setup lang="ts">
/**
 * CSS 实现的类名一览：直接从 src/ 下的样式表里抽 .ak-* / .is-* / data-*，按 块 · 元素 · 修饰 · 状态 分组——永远与实现同步，不手写。
 * 说明文字写在 md 里。
 */
import { onMounted, ref } from "vue";

const props = defineProps<{
  files: string[];
  /** 只列这些块（一张样式表里放了几个组件时用，如 form.css）：只取选择器里出现这些块的规则 */
  blocks?: string[];
}>();
const sheets = import.meta.glob<string>("../../../../packages/css/src/**/*.css", { query: "?raw", import: "default" });

type Group = { block: string; elements: string[]; modifiers: string[] };
const groups = ref<Group[]>([]);
const states = ref<string[]>([]);
const attrs = ref<string[]>([]);

onMounted(async () => {
  let css = (await Promise.all(props.files.map(f => sheets[`../../../../packages/css/src/${f}`]?.() ?? ""))).join("\n").replace(/\/\*[\s\S]*?\*\//g, "");
  if (props.blocks?.length) {
    const mine = new RegExp(`\\.(?:${props.blocks.join("|")})(?=$|[^a-z0-9_-]|__|--)`); // .ak-check 命中 .ak-check / __x / --x，不命中 .ak-check-group
    // 最内层的「选择器 { 声明 }」逐条筛（@media 里的规则也是最内层）；选择器列表按顶层逗号拆开，只留提到这些块的那几个
    const split = (sel: string) => sel.split(/,(?![^(]*\))/).map(x => x.trim());
    css = [...css.matchAll(/([^{}]+)\{([^{}]*)\}/g)]
      .map(m => [split(m[1]).filter(x => mine.test(x)), m[2]] as const)
      .filter(([sels]) => sels.length)
      .map(([sels, body]) => `${sels.join(", ")} {${body}}`)
      .join("\n");
  }
  const classes = new Set([...css.matchAll(/\.(ak-[a-z0-9-]+(?:__[a-z0-9-]+)?(?:--[a-z0-9-]+)?)/g)].map(m => m[1]));
  // 本文件「拥有」的块 = 出现在选择器开头的；.ak-btn--danger.ak-stripes 里的 .ak-stripes 是引用别的组件，不算
  const owned = new Set([...css.matchAll(/(?:^|[{},]\s*)\.(ak-[a-z0-9-]+?)(?=__|--|[\s.:,{[>+~)]|$)/gm)].map(m => m[1]));
  const blocks = new Map<string, Group>();
  for (const cls of classes) {
    const block = cls.split(/__|--/)[0];
    if (!owned.has(block) || (props.blocks?.length && !props.blocks.includes(block))) continue;
    const g = blocks.get(block) ?? blocks.set(block, { block, elements: [], modifiers: [] }).get(block)!;
    if (cls.includes("__")) g.elements.push(cls);
    else if (cls.includes("--")) g.modifiers.push(cls);
  }
  groups.value = [...blocks.values()];
  states.value = [...new Set([...css.matchAll(/\.(is-[a-z0-9-]+)/g)].map(m => m[1]))];
  attrs.value = [...new Set([...css.matchAll(/\[(data-[a-z0-9-]+|aria-[a-z-]+)(?:[~|^$*]?="[^"]*")?\]/g)].map(m => m[0]))];
});
</script>

<template>
  <div class="akd-classes">
    <table>
      <thead>
        <tr><th>块</th><th>元素 __</th><th>修饰 --</th></tr>
      </thead>
      <tbody>
        <tr v-for="g in groups" :key="g.block">
          <td><code>.{{ g.block }}</code></td>
          <td><code v-for="e in g.elements" :key="e">{{ e.slice(g.block.length) }}</code></td>
          <td><code v-for="m in g.modifiers" :key="m">{{ m.slice(g.block.length) }}</code></td>
        </tr>
      </tbody>
    </table>
    <p v-if="states.length || attrs.length" class="akd-classes__extra">
      <span v-if="states.length">状态：<code v-for="s in states" :key="s">.{{ s }}</code></span>
      <span v-if="attrs.length">属性：<code v-for="a in attrs" :key="a">{{ a }}</code></span>
    </p>
  </div>
</template>
