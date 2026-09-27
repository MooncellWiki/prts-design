<script setup lang="ts">
import { computed } from "vue";

import type { IconName } from "../../icons";
import AkIcon from "../Icon/AkIcon.vue";

export type MessageVariant = "info" | "success" | "warning" | "danger" | "neutral" | "accent";

/** 界面 / 系统反馈的提示条（同 Naive 的 NAlert）：左色条 + 淡底；编辑写在正文里的提示用 AkCbox */
const props = withDefaults(
  defineProps<{
    /** 外观（等级色）：info 蓝（默认）· success 绿 · warning 黄 · danger 红 · neutral 灰 · accent 主色 */
    variant?: MessageVariant;
    /** 加粗的标题行（等级色）；要带链接 / 格式时用 #header 插槽 */
    title?: string;
    /** 图标；默认按 variant：success → check，warning / danger → warn，其余 → info */
    icon?: IconName;
    /** 显示图标（同 Naive 的 show-icon） */
    showIcon?: boolean;
    /** 右侧 ✕ 关闭按钮：点了隐藏自己（v-model 变 false）并触发 close */
    closable?: boolean;
    /** 横幅：顶边 3px 色条、文字居中——站点公告 / 页顶通知 */
    banner?: boolean;
    /** 叠斜纹（危险横幅，配 variant="danger"） */
    stripes?: boolean;
  }>(),
  { variant: "info", title: undefined, icon: undefined, showIcon: true },
);

/** 是否显示；不绑定时自己管（关掉就没了），绑定了可以再打开 */
const show = defineModel<boolean>({ default: true });

const emit = defineEmits<{
  /** 点了关闭按钮（之后自己隐藏） */
  close: [];
}>();

defineSlots<{
  /** 正文 */
  default?: () => unknown;
  /** 标题行（代替 title） */
  header?: () => unknown;
  /** 图标（代替 icon；放进 20px 的图标位，颜色跟等级色） */
  icon?: () => unknown;
}>();

const DEFAULT_ICON: Record<MessageVariant, IconName> = {
  info: "info",
  success: "check",
  warning: "warn",
  danger: "warn",
  neutral: "info",
  accent: "info",
};

const classes = computed(() => [
  "ak-message",
  props.variant !== "info" && `ak-message--${props.variant}`,
  { "ak-message--banner": props.banner, "ak-message--stripes": props.stripes },
]);

function close() {
  show.value = false;
  emit("close");
}
</script>

<template>
  <!-- 警告 / 危险是 alert（动态插入时读屏立刻念），其余是 status（礼貌播报） -->
  <div v-if="show" :class="classes" :role="variant === 'warning' || variant === 'danger' ? 'alert' : 'status'">
    <template v-if="showIcon">
      <span v-if="$slots.icon" class="ak-message__icon"><slot name="icon" /></span>
      <AkIcon v-else :name="icon ?? DEFAULT_ICON[variant]" class="ak-message__icon" />
    </template>
    <div class="ak-message__body">
      <div v-if="title || $slots.header" class="ak-message__title"><slot name="header">{{ title }}</slot></div>
      <slot />
    </div>
    <button v-if="closable" type="button" class="ak-message__close" aria-label="关闭" @click="close">✕</button>
  </div>
</template>
