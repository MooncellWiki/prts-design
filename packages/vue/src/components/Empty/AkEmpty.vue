<script setup lang="ts">
/**
 * 空状态（= Naive 的 NEmpty）：虚线框里居中一枚线稿图标 + 标题 + 说明 + 可选的操作。
 * 404 / 403 这类页面级的空，用 code 换成大号状态码。
 */
import type { IconName } from "../../icons";
import AkIcon from "../Icon/AkIcon.vue";

withDefaults(
  defineProps<{
    /** 标题（粗体一行）；传空串不显示 */
    title?: string;
    /** 说明文字（小字，标题下一行）；要放链接时改用默认插槽 */
    description?: string;
    /** 大号状态码（404 / 403）：放在图标的位置，写了就不显示图标 */
    code?: string;
    /** 图标（48px 半透明线稿）；false 不显示 */
    icon?: IconName | false;
  }>(),
  { title: "暂无数据", description: undefined, code: undefined, icon: "empty" },
);

defineSlots<{
  /** 说明（代替 description） */
  default?: () => unknown;
  /** 自定义图标（代替 icon）；自己加 class="ak-empty__icon" 得到 48px 半透明 */
  icon?: () => unknown;
  /** 说明下方的操作（按钮 / 链接） */
  extra?: () => unknown;
}>();
</script>

<template>
  <div class="ak-empty">
    <span v-if="code" class="ak-empty__code">{{ code }}</span>
    <slot v-else name="icon"><AkIcon v-if="icon" :name="icon" class="ak-empty__icon" /></slot>
    <div v-if="title" class="ak-empty__title">{{ title }}</div>
    <div v-if="description || $slots.default" class="ak-fs-xs"><slot>{{ description }}</slot></div>
    <div v-if="$slots.extra" class="ak-flex ak-wrap ak-gap-2 ak-justify-center ak-mt-2"><slot name="extra" /></div>
  </div>
</template>
