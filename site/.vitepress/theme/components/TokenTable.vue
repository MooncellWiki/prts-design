<script setup lang="ts">
/**
 * 令牌表：数据来自 packages/tokens/tokens.json（pnpm tokens 生成），按路径前缀取一组。
 *   <TokenTable prefix="color.brand" />            原始色：色块网格
 *   <TokenTable prefix="theme.background" themed />  语义色：亮 / 暗两列并排（色块直接用解析值，不跟文档站当前主题）
 *   <TokenTable prefix="typography.font-size" sample="size" />   其它：名称 · 值 · 说明（可带字号 / 字体样张）
 */
import { computed } from "vue";

import data from "../../../../packages/tokens/tokens.json";

const props = defineProps<{ prefix: string; themed?: boolean; sample?: "size" | "font" | "space" | "shadow" }>();
type Token = (typeof data.tokens)[number];
const tokens = computed(() => data.tokens.filter(t => t.path.join(".").startsWith(props.prefix + ".")));
const isColor = (t: Token) => t.type === "color";
const css = (t: Token, mode: "light" | "dark") => (typeof t.css === "string" ? t.css : t.css[mode]);
const copy = (s: string) => navigator.clipboard?.writeText(s);
</script>

<template>
  <div v-if="!themed && tokens.every(isColor)" class="akd-swatches">
    <button v-for="t in tokens" :key="t.name" type="button" class="akd-swatch" :title="`复制 var(${t.name})`" @click="copy(`var(${t.name})`)">
      <span class="akd-swatch__chip" :style="{ background: t.resolved.light }" />
      <code class="akd-swatch__name">{{ t.name }}</code>
      <code class="akd-swatch__value">{{ t.resolved.light }}</code>
      <span v-if="t.description" class="akd-swatch__note">{{ t.description }}</span>
    </button>
  </div>
  <table v-else-if="themed" class="akd-tokens">
    <thead>
      <tr><th>令牌</th><th>档案（亮）</th><th>终端（暗）</th><th>说明</th></tr>
    </thead>
    <tbody>
      <tr v-for="t in tokens" :key="t.name">
        <td><code>{{ t.name }}</code></td>
        <td v-for="mode in ['light', 'dark'] as const" :key="mode" :class="`akd-tokens__${mode}`">
          <span v-if="isColor(t)" class="akd-tokens__chip" :style="{ background: t.resolved[mode] }" />
          <code :title="t.resolved[mode]">{{ css(t, mode) }}</code>
        </td>
        <td>{{ t.description }}<template v-if="'descriptionDark' in t && t.descriptionDark"><br />暗：{{ t.descriptionDark }}</template></td>
      </tr>
    </tbody>
  </table>
  <table v-else class="akd-tokens">
    <thead>
      <tr><th>令牌</th><th>值</th><th v-if="sample">样张</th><th>说明</th></tr>
    </thead>
    <tbody>
      <tr v-for="t in tokens" :key="t.name">
        <td><code>{{ t.name }}</code></td>
        <td><code>{{ css(t, "light") }}</code></td>
        <td v-if="sample">
          <span v-if="sample === 'size'" :style="{ fontSize: `var(${t.name})`, lineHeight: 1.2 }">罗德岛 Rhodes</span>
          <span v-else-if="sample === 'font'" :style="{ fontFamily: `var(${t.name})` }">罗德岛 RHODES ISLAND 0123</span>
          <span v-else-if="sample === 'space'" class="akd-tokens__bar" :style="{ width: `var(${t.name})` }" />
          <span v-else-if="sample === 'shadow'" class="akd-tokens__shadow" :style="{ boxShadow: `var(${t.name})` }" />
        </td>
        <td>{{ t.description }}</td>
      </tr>
    </tbody>
  </table>
</template>
