/**
 * 把示例 iframe 里渲染出来的 DOM 写回成排好版的 HTML（Demo 的「HTML」页签）——即 Vue 组件实际输出、MW 模板 / Lua 应当照着输出的结构。
 * 直接走 DOM 而不是解析字符串：注释（Vue 的片段锚点）天然跳过；只有文字 / 行内子节点、且一行放得下的元素写成一行。
 * 同时产出纯文本（复制用）与高亮 HTML（显示用）。
 */
type Seg = [cls: "" | "t" | "a" | "v", text: string];

const VOID = new Set(["area", "base", "br", "col", "embed", "hr", "img", "input", "link", "meta", "source", "track", "wbr"]);
const INLINE = new Set([
  "a", "abbr", "b", "bdi", "br", "button", "cite", "code", "data", "dfn", "em", "i", "img", "input", "kbd", "label", "mark",
  "q", "s", "samp", "select", "small", "span", "strong", "sub", "sup", "time", "u", "var", "wbr", "svg",
]);
const MAX = 100;

const esc = (s: string) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
const escAttr = (s: string) => esc(s).replace(/"/g, "&quot;");

function openTag(el: Element): Seg[] {
  const segs: Seg[] = [["t", `<${el.localName}`]];
  for (const a of el.attributes) {
    if (a.name.startsWith("data-v-")) continue;
    segs.push(["", " "], ["a", a.name]);
    if (a.value !== "") segs.push(["", "="], ["v", `"${escAttr(a.value)}"`]);
  }
  segs.push(["t", ">"]);
  return segs;
}
const closeTag = (el: Element): Seg[] => [["t", `</${el.localName}>`]];
const text = (segs: Seg[]) => segs.map(s => s[1]).join("");

/** 能否写成一行：只有文字 / 行内元素（递归），svg 整个当一个原子 */
function inlineSegs(node: Node): Seg[] | null {
  if (node.nodeType === Node.TEXT_NODE) return [["", esc((node.textContent ?? "").replace(/\s+/g, " "))]];
  if (node.nodeType !== Node.ELEMENT_NODE) return [];
  const el = node as Element;
  if (el.localName === "svg") return [["t", el.outerHTML.replace(/\s+/g, " ").replace(/ xmlns="[^"]+"/, "")]];
  if (!INLINE.has(el.localName)) return null;
  if (VOID.has(el.localName)) return openTag(el);
  const out: Seg[] = [...openTag(el)];
  for (const c of el.childNodes) {
    const s = inlineSegs(c);
    if (!s) return null;
    out.push(...s);
  }
  return [...out, ...closeTag(el)];
}

function lines(node: Node, depth: number, out: Seg[][]) {
  const pad: Seg = ["", "  ".repeat(depth)];
  if (node.nodeType === Node.TEXT_NODE) {
    const t = (node.textContent ?? "").replace(/\s+/g, " ").trim();
    if (t) out.push([pad, ["", esc(t)]]);
    return;
  }
  if (node.nodeType !== Node.ELEMENT_NODE) return;
  const el = node as Element;
  if (el.localName === "script" || el.localName === "style") return;
  const one = inlineSegs(el) ?? (hasOnlyInlineChildren(el) ? [...openTag(el), ...inner(el), ...closeTag(el)] : null);
  if (one && text(one).length + depth * 2 <= MAX) {
    out.push([pad, ...one]);
    return;
  }
  if (VOID.has(el.localName)) {
    out.push([pad, ...openTag(el)]);
    return;
  }
  out.push([pad, ...openTag(el)]);
  for (const c of el.childNodes) lines(c, depth + 1, out);
  out.push([pad, ...closeTag(el)]);
}
const hasOnlyInlineChildren = (el: Element) => [...el.childNodes].every(c => inlineSegs(c) !== null);
const inner = (el: Element) => [...el.childNodes].flatMap(c => inlineSegs(c) ?? []);
const display = (t: string) => t.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

/** text = 合法的 HTML 源码（复制用）；html = 对源码整体转义后按词法着色（显示用） */
export function serialize(root: Element): { text: string; html: string } {
  const out: Seg[][] = [];
  for (const c of root.childNodes) lines(c, 0, out);
  return {
    text: out.map(l => text(l).trimEnd()).join("\n"),
    html: out.map(l => l.map(([c, t]) => (c ? `<span class="akd-hl-${c}">${display(t)}</span>` : display(t))).join("")).join("\n"),
  };
}
