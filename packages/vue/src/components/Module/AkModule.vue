<script setup lang="ts">
import { computed, useId } from "vue";

export type ModuleColor = "red" | "blue" | "green" | "yellow" | "purple";

/**
 * 模组卡（= 现网 {{模组}}）：一张卡装完型号 + 名称 + 故事 + 三阶段表 + 解锁任务 + 解锁需求与材料。
 * 结构照 Naive 的 NCard（#header-extra）；故事默认定高 5 行、框内可滚动（同现网），「全文阅读」展开成全高——
 * 这里用组件内状态（v-model）代替 CSS 版的 data-toggle-class，真皮肤上也能用。
 */
const props = withDefaults(
  defineProps<{
    /** 模组名（h4） */
    name: string;
    /** 模组图地址（游戏 uniequip 图；原型证章放分支图标） */
    src?: string;
    /** 型号文字：SWO-X / Original … */
    typeName?: string;
    /** 型号图标地址（游戏模组类型小图标，放在型号文字前） */
    typeIcon?: string;
    /** 型号色（= 模板参数「类型颜色」，游戏模组类型底色）：左侧粗色条 + 型号块 + 阶段条；不写 = 原型证章的灰 */
    color?: ModuleColor;
    /** 「说明 ⓘ」的悬停解释（调整效果先于潜能生效 …）；不写不显示 */
    hint?: string;
    /** 故事可折叠：默认定高 5 行可滚动 +「全文阅读」开关；false 时全文展开、不出开关（原型证章那种短文） */
    collapsible?: boolean;
    /** 模组解锁任务（纯文本，一条一行）；要链接关卡时改用 #tasks 插槽 */
    tasks?: string[];
  }>(),
  { src: undefined, typeName: undefined, typeIcon: undefined, color: undefined, hint: undefined, collapsible: true, tasks: undefined },
);

/** 故事是否展开（「全文阅读」/「收起全文」） */
const open = defineModel<boolean>({ default: false });

const slots = defineSlots<{
  /** 故事（基础信息）：若干 <p>，行内换行用 <br> */
  default?: () => unknown;
  /** 名称之后的附加内容（原型证章的说明标签等） */
  "header-extra"?: () => unknown;
  /** 三阶段表的行：若干 AkModuleStage */
  stages?: () => unknown;
  /** 解锁任务：若干 <li>（排在 tasks 之后） */
  tasks?: () => unknown;
  /** 解锁需求与材料表的行：若干 AkModuleUnlock */
  unlock?: () => unknown;
}>();

const id = useId();
const expanded = computed(() => !props.collapsible || open.value);
const hasTasks = computed(() => !!props.tasks?.length || !!slots.tasks);
</script>

<template>
  <div class="ak-module" :data-color="color">
    <div class="ak-module__img"><img v-if="src" :src="src" alt="" /></div>
    <div :class="['ak-module__main', { 'is-open': expanded }]">
      <div class="ak-module__head">
        <span v-if="typeName || typeIcon" class="ak-module__type"><img v-if="typeIcon" :src="typeIcon" alt="" />{{ typeName }}</span>
        <h4 class="ak-module__name">{{ name }}</h4>
        <span v-if="hint" class="ak-module__hint ak-tip--wide" :data-ak-tip="hint" tabindex="0">说明 ⓘ</span>
        <slot name="header-extra" />
      </div>
      <div v-if="$slots.default" :id="`${id}-story`" class="ak-module__story"><slot /></div>
      <label v-if="collapsible && $slots.default" class="ak-module__more">
        <input v-model="open" type="checkbox" :aria-controls="`${id}-story`" />
        <span class="off">全文阅读 »</span><span class="on">收起全文 «</span>
      </label>
    </div>
    <div v-if="$slots.stages || hasTasks || $slots.unlock" class="ak-module__body">
      <table v-if="$slots.stages" class="ak-module__stages">
        <thead>
          <tr><th scope="col">阶段</th><th scope="col">属性</th><th scope="col">特性 / 天赋变化</th></tr>
        </thead>
        <tbody><slot name="stages" /></tbody>
      </table>
      <div v-if="hasTasks" class="ak-module__tasks">
        <span class="ak-overline">模组解锁任务</span>
        <ul>
          <li v-for="(t, i) in tasks" :key="i">{{ t }}</li>
          <slot name="tasks" />
        </ul>
      </div>
      <table v-if="$slots.unlock" class="ak-module__unlock">
        <thead>
          <tr><th scope="col">阶段</th><th scope="col">解锁需求</th><th scope="col">材料消耗</th></tr>
        </thead>
        <tbody><slot name="unlock" /></tbody>
      </table>
    </div>
  </div>
</template>
