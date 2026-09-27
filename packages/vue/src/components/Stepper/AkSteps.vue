<script setup lang="ts">
import { Comment, Fragment, type VNode } from "vue";

import AkStep, { type StepStatus } from "./AkStep.vue";

/**
 * 步骤条（= Naive 的 NSteps，只有横排）：一排带序号的步骤 + 连线，放若干 AkStep。
 * 同 AkTabs：从默认插槽读 AkStep 的 props 自己画，首次渲染 / SSR 预渲染就是完整的。只是展示进度，不可点。
 * 输出 ol > li；ol 上显式 role="list"：Safari（VoiceOver）对 list-style: none 的列表不报列表语义，写上补回。
 */
const props = defineProps<{
  /** 当前步骤（从 1 数，同 Naive）：之前的已完成、这一步是当前、之后未到；超过步数 = 全部完成；不写则各步按自己的 status */
  current?: number;
  /** 读屏用的列表名（如「精英化进度」） */
  label?: string;
}>();

const slots = defineSlots<{
  /** 若干 AkStep */
  default?: () => VNode[];
}>();

interface StepDef {
  key: PropertyKey;
  status: StepStatus;
  /** 步骤名：默认插槽，没有就用 title 字符串 */
  title: (() => unknown) | string | undefined;
}

const flatten = (nodes: VNode[]): VNode[] =>
  nodes.flatMap(n => (n.type === Fragment && Array.isArray(n.children) ? flatten(n.children as VNode[]) : n.type === Comment ? [] : [n]));

/** 插槽只能在渲染期调用，所以由模板调用 */
function collect(): StepDef[] {
  return flatten(slots.default?.() ?? [])
    .filter(n => n.type === AkStep)
    .map((n, i) => {
      const p = (n.props ?? {}) as Record<string, unknown>;
      const s = (n.children ?? {}) as Record<string, (() => unknown) | undefined>;
      const c = props.current;
      const derived: StepStatus = c === undefined ? "wait" : i + 1 < c ? "done" : i + 1 === c ? "active" : "wait";
      return { key: n.key ?? i, status: (p.status as StepStatus | undefined) ?? derived, title: s.default ?? (p.title as string | undefined) };
    });
}

/** 把插槽函数 / 字符串原样渲染；定义在外面保持同一个组件类型，重渲染时不重建 */
const Render = (p: { content: unknown }) => (typeof p.content === "function" ? p.content() : p.content);
</script>

<template>
  <ol class="ak-stepper" role="list" :aria-label="label">
    <li
      v-for="s in collect()"
      :key="s.key"
      :class="['ak-step', s.status !== 'wait' && `is-${s.status}`]"
      :aria-current="s.status === 'active' ? 'step' : undefined"
    >
      <Render :content="s.title" /><span v-if="s.status === 'done'" class="ak-sr-only">（已完成）</span>
    </li>
  </ol>
</template>
