/**
 * 游戏内富文本：gamedata 里技能 / 天赋 / 关卡描述的原始标记 → 结点树（AkRichText 再画成 .ak-rt-* 的 span）。
 *
 *   <@ba.vup>…</>     样式标签（gamedata_const.richTextStyles）→ .ak-rt-vup；命名空间不论（cc.vup / ba.vup 同色），认不得的样式只留文字
 *   <$ba.stun>…</>    术语（termDescriptionDict）→ .ak-rt-term，说明作悬停提示
 *   {atk_scale:0%}    blackboard 占位符：前缀 - 取负；:0% 乘 100 加 %、:0.0 保留一位（# 位去掉末尾的 0）；没有格式就原样
 *   换行              → <br>
 *
 * 标签可以嵌套（<@ba.kw><$ba.stun>晕眩</></>）；没闭合的在末尾自动闭合，多出来的 </> 忽略。
 */

export type RtNode =
  | { type: "text"; text: string }
  | { type: "br" }
  | { type: "var"; key: string; negative: boolean; format?: string; raw: string }
  | { type: "style" | "term"; key: string; children: RtNode[] };

const TOKEN = /<([@$])([^<>\s]+?)>|<\/>|\{(-)?([^{}:\s]+?)(?::([^{}\s]+))?\}|\r?\n/g;

export function parseRichText(src: string): RtNode[] {
  const root: RtNode[] = [];
  const stack: RtNode[][] = [root];
  const top = () => stack[stack.length - 1];
  let last = 0;
  for (const m of src.matchAll(TOKEN)) {
    if (m.index > last) top().push({ type: "text", text: src.slice(last, m.index) });
    last = m.index + m[0].length;
    if (m[1]) {
      const node: RtNode = { type: m[1] === "$" ? "term" : "style", key: m[2], children: [] };
      top().push(node);
      stack.push(node.children);
    } else if (m[0] === "</>") {
      if (stack.length > 1) stack.pop();
    } else if (m[4]) {
      top().push({ type: "var", key: m[4], negative: !!m[3], format: m[5], raw: m[0] });
    } else {
      top().push({ type: "br" });
    }
  }
  if (last < src.length) top().push({ type: "text", text: src.slice(last) });
  return root;
}

/** 有 .ak-rt-* 类的样式名（rich-text.css）；mission.levelname 另算 */
const STYLES = new Set(["vup", "vdown", "rem", "kw", "imp", "drop", "enemy", "gild", "acrem", "level", "talpu", "pn"]);

/** <@ns.name> → 类名；认不得的返回 undefined（只留文字） */
export function styleClass(key: string): string | undefined {
  if (key === "mission.levelname") return "ak-rt-level";
  const name = key.slice(key.lastIndexOf(".") + 1).toLowerCase();
  return STYLES.has(name) ? `ak-rt-${name}` : undefined;
}

/** 占位符取值 → 文字：{atk_scale:0%} + 2.6 → "260%"，{-cost:0.0} + 1.25 → "-1.3" */
export function formatVar(value: number | string, format?: string, negative = false): string {
  if (typeof value !== "number") return negative ? `-${value}` : value;
  const percent = format?.endsWith("%") ?? false;
  const n = (negative ? -value : value) * (percent ? 100 : 1);
  const digits = format ? (/\.([0#]+)/.exec(format)?.[1] ?? "") : undefined;
  let s: string;
  if (digits === undefined) s = String(Math.round(n * 1e6) / 1e6);
  else {
    s = n.toFixed(digits.length);
    if (digits.includes("#") && s.includes(".")) s = s.replace(/\.?0+$/, "");
  }
  return percent ? `${s}%` : s;
}

/** 一两句话的说明（术语 / SP 说明）用可折行的宽气泡 .ak-tip--wide，短的一行放下 */
export const isWideTip = (tip: string | undefined) => !!tip && tip.length > 12;
