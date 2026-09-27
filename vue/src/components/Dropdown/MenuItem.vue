<script setup lang="ts">
/** AkDropdown 内部用的一个菜单项（不导出）：普通项是 li[role=menuitem]；有 href 的是 li[role=none] > a[role=menuitem]（MW 门户链接的结构） */
import { computed } from "vue";

import AkIcon from "../Icon/AkIcon.vue";
import type { DropdownKey, DropdownOption } from "./types";

const props = defineProps<{
  /** 菜单项 */
  option: DropdownOption;
  /** AkDropdown 的 value：有值时是单选菜单项 */
  value?: DropdownKey;
}>();

const emit = defineEmits<{
  /** 点了这一项（禁用项也会触发，由 AkDropdown 判断） */
  select: [e: MouseEvent];
}>();

const radio = computed(() => props.value !== undefined);
const active = computed(() => radio.value && props.option.key === props.value);
const attrs = computed(() => ({
  role: radio.value ? "menuitemradio" : "menuitem",
  tabindex: -1,
  "aria-checked": radio.value ? active.value : undefined,
  "aria-disabled": props.option.disabled || undefined,
  class: ["ak-menu__item", { "is-active": active.value, "ak-menu__item--danger": props.option.danger }],
}));
</script>

<template>
  <li v-if="!option.href" v-bind="attrs" @click="emit('select', $event)">
    <AkIcon v-if="option.icon" :name="option.icon" :size="16" />{{ option.label }}
  </li>
  <li v-else role="none">
    <a :href="option.disabled ? undefined : option.href" v-bind="attrs" @click="emit('select', $event)">
      <AkIcon v-if="option.icon" :name="option.icon" :size="16" />{{ option.label }}
    </a>
  </li>
</template>
