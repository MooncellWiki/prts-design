<script setup lang="ts">
/** 一叠头像（= Naive 的 NAvatarGroup）：后一枚压前一枚 8px。给 options 由组件画（可用 max 收成「+N」），或者在默认插槽里直接放 AkAvatar。 */
import { computed, provide } from "vue";

import AkAvatar from "./AkAvatar.vue";
import { avatarGroupKey, type AvatarSize } from "./context";

export interface AvatarOption {
  /** 图片地址 */
  src: string;
  /** 替代文本（人名）；组有意义时每枚都写 */
  alt?: string;
}

const props = withDefaults(
  defineProps<{
    /** 头像列表（同 Naive 的 options）；不写就用默认插槽里的 AkAvatar */
    options?: AvatarOption[];
    /** 最多画几枚，其余收成一枚「+N」（只对 options 生效） */
    max?: number;
    /** 组内头像的尺寸（头像自己写了 size 以头像为准） */
    size?: AvatarSize;
    /** 读屏用的组名（「参与干员」） */
    label?: string;
  }>(),
  { options: undefined, max: undefined, size: undefined, label: undefined },
);

defineSlots<{
  /** 若干 AkAvatar（不用 options 时） */
  default?: () => unknown;
}>();

provide(avatarGroupKey, props);

const shown = computed(() => (props.options && props.max !== undefined ? props.options.slice(0, props.max) : (props.options ?? [])));
const rest = computed(() => (props.options?.length ?? 0) - shown.value.length);
</script>

<template>
  <div class="ak-avatar-group" :role="label ? 'group' : undefined" :aria-label="label">
    <template v-if="options">
      <AkAvatar v-for="(o, i) in shown" :key="i" :src="o.src" :alt="o.alt" />
      <AkAvatar v-if="rest > 0">+{{ rest }}</AkAvatar>
    </template>
    <slot v-else />
  </div>
</template>
