/**
 * virtual:akds-meta —— 用 vue-component-meta 从 Vue 组件的 TS 类型 + JSDoc 抽出 props / events / slots，给文档站的 Props 表。
 * （≈ Primer 的 generated/components.json，只是这里直接读类型，不另写 docs.json）
 */
import { resolve } from "node:path";
import { globSync, readFileSync } from "node:fs";
import type { UserConfig } from "vitepress";
import { createChecker, type PropertyMetaSchema } from "vue-component-meta";

import { icons } from "../../../packages/vue/src/icons";

/** VitePress 1.x 自带 Vite 5，仓库根目录的 vite 是 8（Storybook 用）——插件类型按 VitePress 的来 */
type Plugin = Extract<NonNullable<NonNullable<UserConfig["vite"]>["plugins"]>[number], { name: string }>;

const ID = "virtual:akds-meta";
const root = resolve(import.meta.dirname, "../../..");
const ICON_NAMES = Object.keys(icons);

export interface PropDoc { name: string; type: string; values?: string[]; default?: string; required: boolean; description: string }
export interface ComponentDoc { props: PropDoc[]; events: { name: string; signature: string; description: string }[]; slots: { name: string; description: string }[] }

/** 类型显示：图标名那一长串收成 IconName；字面量联合拆成可选值 */
function describeType(type: string, schema: PropertyMetaSchema): Pick<PropDoc, "type" | "values"> {
  const t = type.replace(/ \| undefined$/, "");
  if (ICON_NAMES.every(n => t.includes(`"${n}"`))) return { type: "IconName" };
  if (typeof schema === "object" && schema.kind === "enum" && Array.isArray(schema.schema)) {
    const values = schema.schema.filter((s): s is string => typeof s === "string" && s !== "undefined");
    if (values.length > 1 && values.every(v => /^["\d]/.test(v))) return { type: t, values };
  }
  return { type: t };
}

// vue-component-meta 读不到具名元组写法 defineEmits<{ remove: [] }>() 上面那行 JSDoc，从源码里补：
// 取 defineEmits<{ … }> 这一段，找每个「JSDoc 注释 + 事件名:」
function emitDocs(file: string): Record<string, string> {
  const src = readFileSync(file, "utf8");
  const block = /defineEmits<\{([\s\S]*?)\}>\(\)/.exec(src)?.[1] ?? "";
  const out: Record<string, string> = {};
  for (const m of block.matchAll(/\/\*\*([\s\S]*?)\*\/\s*["']?([\w:-]+)["']?\s*:/g))
    out[m[2]] = m[1].replace(/^\s*\*\s?/gm, "").trim();
  return out;
}

type Checker = ReturnType<typeof createChecker>;

function describe(checker: Checker, file: string): ComponentDoc {
  const meta = checker.getComponentMeta(file);
  const docs = emitDocs(file);
  return {
    props: meta.props
      .filter(p => !p.global)
      .map(p => ({
        name: p.name,
        ...describeType(p.type, p.schema),
        default: p.default && p.default !== "undefined" ? p.default : p.type.startsWith("boolean") ? "false" : undefined,
        required: p.required,
        description: p.description,
      })),
    events: meta.events.map(e => ({ name: e.name, signature: e.type, description: e.description || docs[e.name] || "" })),
    slots: meta.slots.map(s => ({ name: s.name, description: s.description })),
  };
}

export function akdsMeta(): Plugin {
  let checker: Checker | undefined;
  /** 检查器建立时认识的组件文件：出现新文件就整个重建（旧检查器连同它的 TS 语言服务一起丢掉；不重建会报 not part of the project） */
  let known = new Set<string>();
  /** 按文件缓存：改哪个文件只重算哪个——每次全量重算一百多个组件，开发服务器跑久了会把堆吃满（曾 OOM） */
  const cache = new Map<string, ComponentDoc>();
  const files = () => globSync("packages/vue/src/components/*/Ak*.vue", { cwd: root }).map(f => resolve(root, f));
  return {
    name: "akds-meta",
    resolveId: id => (id === ID ? "\0" + ID : undefined),
    load(id) {
      if (id !== "\0" + ID) return;
      const list = files();
      if (!checker || list.some(f => !known.has(f))) {
        checker = createChecker(resolve(root, "tsconfig.json"), { schema: { ignore: ["MouseEvent", "KeyboardEvent"] } });
        known = new Set(list);
        cache.clear();
      }
      const out: Record<string, ComponentDoc> = {};
      for (const file of list) {
        this.addWatchFile(file);
        let doc = cache.get(file);
        if (!doc) cache.set(file, (doc = describe(checker, file)));
        out[file.split("/").pop()!.replace(/\.vue$/, "")] = doc;
      }
      return `export default ${JSON.stringify(out)}`;
    },
    async handleHotUpdate(ctx) {
      if (!ctx.file.endsWith(".vue") || !ctx.file.includes("/packages/vue/src/components/")) return;
      checker?.updateFile(ctx.file, await ctx.read());
      cache.delete(ctx.file);
      const mod = ctx.server.moduleGraph.getModuleById("\0" + ID);
      if (mod) ctx.server.moduleGraph.invalidateModule(mod);
    },
  };
}
