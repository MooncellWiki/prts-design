<script setup lang="ts">
/**
 * 选择器一览：从 src/ 下的样式表里逐条抽出规则的选择器与声明了哪些属性（含 @media / @supports 里的）——永远与实现同步，不手写。
 * L1（MW 内容样式）/ L2（皮肤骨架）大多是 MediaWiki 原生选择器（.wikitable / .mw-message-box / #catlinks …），
 * CssClasses 只认 .ak-* 块，这一层用它。正文排版规则上的 :not(:where(.ak-not-prose, .ak-not-prose *)) 后缀统一省略（见「排版」页）。
 *   <CssSelectors :files="['base/tables.css']" />
 */
import { onMounted, ref } from "vue";

const props = defineProps<{ files: string[]; open?: boolean }>();
const sheets = import.meta.glob<string>("../../../../packages/css/src/**/*.css", { query: "?raw", import: "default" });

type Rule = { at: string; selectors: string[]; props: string[] };
const result = ref<{ file: string; rules: Rule[] }[]>([]);

const NOT_PROSE = /:not\(:where\(\.ak-not-prose, \.ak-not-prose \*\)\)/g;

/** 够用的 CSS 扫描：跟踪花括号与 at-rule 前导，@keyframes / @font-face 整块跳过 */
function parse(css: string): Rule[] {
  const src = css.replace(/\/\*[\s\S]*?\*\//g, "");
  const rules: Rule[] = [];
  const stack: string[] = [];
  let buf = "";
  let i = 0;
  while (i < src.length) {
    const ch = src[i];
    if (ch === "{") {
      const prelude = buf.trim().replace(/\s+/g, " ");
      buf = "";
      if (/^@(keyframes|-webkit-keyframes|font-face|property)\b/.test(prelude)) {
        let depth = 1;
        i++;
        while (i < src.length && depth) {
          if (src[i] === "{") depth++;
          else if (src[i] === "}") depth--;
          i++;
        }
        continue;
      }
      if (prelude.startsWith("@")) {
        stack.push(prelude);
        i++;
        continue;
      }
      const end = src.indexOf("}", i);
      const body = src.slice(i + 1, end);
      const names = [
        ...new Set(
          body
            .split(";")
            .map(d => d.split(":")[0].trim())
            .filter(n => /^-*[a-z_][\w-]*$/i.test(n)),
        ),
      ];
      rules.push({
        at: stack.join(" › "),
        selectors: splitSelectors(prelude).map(s => s.replace(NOT_PROSE, "").trim()),
        props: names,
      });
      i = end + 1;
      continue;
    }
    if (ch === "}") {
      stack.pop();
      buf = "";
      i++;
      continue;
    }
    if (ch === ";" && !stack.length) buf = ""; // @import / @charset
    else buf += ch;
    i++;
  }
  return rules;
}

/** 按顶层逗号拆选择器列表（括号里的逗号不拆） */
function splitSelectors(s: string) {
  const out: string[] = [];
  let depth = 0;
  let cur = "";
  for (const ch of s) {
    if (ch === "(") depth++;
    else if (ch === ")") depth--;
    if (ch === "," && !depth) {
      out.push(cur);
      cur = "";
    } else cur += ch;
  }
  if (cur.trim()) out.push(cur);
  return out;
}

onMounted(async () => {
  result.value = await Promise.all(
    props.files.map(async file => ({ file, rules: parse((await sheets[`../../../../packages/css/src/${file}`]?.()) ?? "") })),
  );
});
</script>

<template>
  <div class="akd-selectors">
    <details v-for="f in result" :key="f.file" :open="open">
      <summary>
        <code>src/{{ f.file }}</code><span>{{ f.rules.length }} 条规则</span>
      </summary>
      <table>
        <thead>
          <tr><th>选择器</th><th>声明</th></tr>
        </thead>
        <tbody>
          <template v-for="(r, i) in f.rules" :key="i">
            <tr v-if="r.at && r.at !== f.rules[i - 1]?.at" class="akd-selectors__at">
              <td colspan="2"><code>{{ r.at }}</code></td>
            </tr>
            <tr>
              <td :class="{ 'akd-selectors__in': r.at }"><code v-for="s in r.selectors" :key="s">{{ s }}</code></td>
              <td class="akd-selectors__props">{{ r.props.join(" · ") }}</td>
            </tr>
          </template>
        </tbody>
      </table>
    </details>
  </div>
</template>

<style scoped>
.akd-selectors details { margin: 12px 0; border: 1px solid var(--ak-border); }
.akd-selectors summary { display: flex; align-items: baseline; gap: 12px; padding: 8px 12px; cursor: pointer; background: var(--ak-bg-surface); font-size: 13px; }
.akd-selectors summary span { color: var(--ak-fg-muted); font-size: 12px; }
.akd-selectors table { display: table; width: 100%; margin: 0; font-size: 12px; border-collapse: collapse; }
.akd-selectors th, .akd-selectors td { border-left: 0; border-right: 0; padding: 4px 12px; vertical-align: top; }
.akd-selectors td code { display: block; width: max-content; max-width: 100%; margin: 1px 0; font-size: 12px; white-space: pre-wrap; overflow-wrap: anywhere; }
.akd-selectors__props { color: var(--ak-fg-muted); min-width: 160px; }
.akd-selectors__in { padding-left: 24px !important; }
.akd-selectors__at td { background: var(--ak-bg-surface-2); }
.akd-selectors__at code { background: none !important; color: var(--ak-fg-secondary); }
</style>
