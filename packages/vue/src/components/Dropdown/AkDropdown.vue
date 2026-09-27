<script setup lang="ts">
/**
 * 下拉菜单（同 Naive 的 NDropdown）：默认插槽放触发元素（一般是 AkButton），options 给菜单项，选中触发 select。
 * 键盘与 ARIA 按 WAI-ARIA 菜单按钮（Menu Button）：Enter / 空格 / ↓ 打开并落在第一项，↑ 落在最后一项；
 * 菜单里 ↑ ↓ Home End 移动、首字母跳转、Enter / 空格选中、Esc 收起并把焦点还给触发元素、Tab 收起并离开；点外面收起。
 */
import { computed, nextTick, onBeforeUnmount, onMounted, useId, useTemplateRef, watch, type VNode } from "vue";

import { Render, decorateTrigger, firstId } from "../Tooltip/trigger";
import MenuItem from "./MenuItem.vue";
import type { DropdownKey, DropdownMixedOption, DropdownOption } from "./types";

const props = withDefaults(
  defineProps<{
    /** 菜单项：{ key, label, icon?, disabled?, danger?, href? }；{ type: "divider" } 分隔线；{ type: "group", label, children } 带小标题的一组 */
    options: DropdownMixedOption[];
    /** 菜单对齐：bottom-start 与触发元素左对齐（默认）· bottom-end 右对齐（靠页面右边的触发元素用） */
    placement?: "bottom-start" | "bottom-end";
    /** 当前选中项的 key：该项高亮，菜单变成单选菜单（menuitemradio + aria-checked），打开时落在它上面 */
    value?: DropdownKey;
    /** 读屏用的菜单名；不写时用触发元素的文字 */
    label?: string;
    /** 禁用：触发元素点了不展开 */
    disabled?: boolean;
  }>(),
  { placement: "bottom-start", value: undefined, label: undefined },
);

/** 菜单是否展开 */
const model = defineModel<boolean>({ default: false });

const emit = defineEmits<{
  /** 选了一项（点击 / Enter / 空格）；之后菜单收起、焦点回到触发元素。有 href 的项照常跳转 */
  select: [key: DropdownKey, option: DropdownOption];
}>();

const slots = defineSlots<{
  /** 触发元素：取第一个元素 / 组件，自动补 aria-haspopup / aria-expanded / aria-controls 与键盘；id 它自己写了就沿用，没写才补一个（菜单的 aria-labelledby 指向它） */
  default?: () => VNode[];
}>();

const id = useId();
const triggerId = `${id}-trigger`;
const menuId = `${id}-menu`;
const root = useTemplateRef<HTMLElement>("root");
const menu = useTemplateRef<HTMLElement>("menu");

const items = () => [...(menu.value?.querySelectorAll<HTMLElement>('[role="menuitem"], [role="menuitemradio"]') ?? [])];
/** 触发元素 = 根的第一个子元素 */
const triggerEl = () => root.value?.firstElementChild as HTMLElement | null | undefined;

async function openMenu(focus: "first" | "last") {
  model.value = true;
  await nextTick(); // 等 .is-open 生效（收起时菜单 display: none，聚焦不了）
  const list = items();
  const checked = list.find(el => el.getAttribute("aria-checked") === "true");
  (checked ?? (focus === "first" ? list[0] : list.at(-1)))?.focus();
}

function closeMenu(returnFocus: boolean) {
  model.value = false;
  if (returnFocus) triggerEl()?.focus();
}

function onTriggerClick() {
  if (props.disabled) return;
  if (model.value) closeMenu(false);
  else openMenu("first");
}

function onTriggerKeydown(e: KeyboardEvent) {
  if (props.disabled || !["Enter", " ", "ArrowDown", "ArrowUp"].includes(e.key)) return;
  e.preventDefault(); // 也拦掉 Enter / 空格随后合成的 click，免得刚打开又关上
  openMenu(e.key === "ArrowUp" ? "last" : "first");
}

const triggerAttrs = computed(() => ({
  "aria-haspopup": "menu",
  "aria-expanded": model.value,
  "aria-controls": menuId,
  onClick: onTriggerClick,
  onKeydown: onTriggerKeydown,
}));

/** 渲染期取触发元素：它自己写了 id 就沿用（菜单的 aria-labelledby 跟着它），没写才补生成的 triggerId。
 *  插槽只能在渲染期调用，所以由模板调用，结果记在 rendered 里给后面的菜单用（同一次渲染、触发元素在前） */
const rendered = { triggerId };
function renderTrigger() {
  const nodes = slots.default?.();
  const own = firstId(nodes);
  rendered.triggerId = own ?? triggerId;
  return decorateTrigger(nodes, own === undefined ? { id: triggerId, ...triggerAttrs.value } : triggerAttrs.value);
}

/** 首字母跳转：从当前项往后找第一个文字以这个字符开头的 */
function typeahead(list: HTMLElement[], from: number, ch: string) {
  const c = ch.toLowerCase();
  for (let k = 1; k <= list.length; k++) {
    const el = list[(from + k) % list.length];
    if (el.textContent?.trim().toLowerCase().startsWith(c)) return el.focus();
  }
}

function onMenuKeydown(e: KeyboardEvent) {
  const list = items();
  const i = list.indexOf(e.target as HTMLElement);
  const go = (n: number) => list[(n + list.length) % list.length]?.focus();
  switch (e.key) {
    case "ArrowDown":
      go(i + 1);
      break;
    case "ArrowUp":
      go(i < 0 ? -1 : i - 1);
      break;
    case "Home":
    case "PageUp":
      go(0);
      break;
    case "End":
    case "PageDown":
      go(-1);
      break;
    case "Escape":
      closeMenu(true);
      break;
    case "Tab":
      closeMenu(false); // 不拦：焦点照常移到菜单后面的元素
      return;
    case "Enter":
    case " ":
      list[i]?.click(); // <a> 项会照常跳转
      break;
    default:
      if (e.key.length !== 1 || e.ctrlKey || e.metaKey || e.altKey) return;
      typeahead(list, i, e.key);
  }
  e.preventDefault();
  e.stopPropagation(); // Esc 不要顺带关掉外面的对话框
}

function onSelect(e: MouseEvent, o: DropdownOption) {
  if (o.disabled) {
    e.preventDefault();
    return;
  }
  emit("select", o.key, o);
  closeMenu(true);
}

/** 展开时点外面收起（监听挂在组件所在的文档上——示例在 iframe 里时不是全局 document） */
function onOutside(e: PointerEvent) {
  if (!root.value?.contains(e.target as Node)) closeMenu(false);
}
let doc: Document | undefined;
function syncOutside() {
  doc?.removeEventListener("pointerdown", onOutside, true);
  doc = model.value ? root.value?.ownerDocument : undefined;
  doc?.addEventListener("pointerdown", onOutside, true);
}
watch(model, syncOutside, { flush: "post" });
onMounted(syncOutside);
onBeforeUnmount(() => doc?.removeEventListener("pointerdown", onOutside, true));
</script>

<template>
  <!-- ak-not-prose：菜单是 ul / li / a，别吃正文的列表符、段距与链接色 -->
  <div ref="root" :class="['ak-dropdown', 'ak-not-prose', { 'is-open': model }]">
    <Render :content="renderTrigger()" />
    <ul
      :id="menuId"
      ref="menu"
      role="menu"
      :class="['ak-menu', placement === 'bottom-end' && 'ak-menu--right']"
      :aria-labelledby="label ? undefined : rendered.triggerId"
      :aria-label="label"
      @keydown="onMenuKeydown"
    >
      <template v-for="(o, i) in options" :key="o.key ?? `_${i}`">
        <li v-if="o.type === 'divider'" class="ak-menu__sep" role="separator" />
        <li v-else-if="o.type === 'group'" class="ak-menu__group" role="group" :aria-label="o.label">
          <!-- 组名由 aria-label 念，这里只给眼睛看 -->
          <div class="ak-menu__label" aria-hidden="true">{{ o.label }}</div>
          <ul role="none">
            <template v-for="(c, j) in o.children" :key="c.key ?? `_${j}`">
              <li v-if="c.type === 'divider'" class="ak-menu__sep" role="separator" />
              <MenuItem v-else :option="c" :value="value" @select="onSelect($event, c)" />
            </template>
          </ul>
        </li>
        <MenuItem v-else :option="o" :value="value" @select="onSelect($event, o)" />
      </template>
    </ul>
  </div>
</template>
