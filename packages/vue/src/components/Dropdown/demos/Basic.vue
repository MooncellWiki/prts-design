<script setup lang="ts">
import { computed, ref } from "vue";

import AkButton from "../../Button/AkButton.vue";
import AkDropdown from "../AkDropdown.vue";
import type { DropdownMixedOption, DropdownOption } from "../types";

const actions: DropdownMixedOption[] = [
  { key: "move", label: "移动", icon: "move" },
  { key: "protect", label: "保护", icon: "lock" },
  { key: "purge", label: "刷新", icon: "refresh", disabled: true },
  { type: "divider" },
  { key: "delete", label: "删除", icon: "trash", danger: true },
];
const last = ref("");

const langs: DropdownOption[] = [
  { key: "cn", label: "中文-普通话" },
  { key: "yue", label: "中文-方言" },
  { key: "jp", label: "日文" },
  { key: "en", label: "英文" },
  { key: "kr", label: "韩文" },
];
const lang = ref("jp");
const langLabel = computed(() => langs.find(l => l.key === lang.value)?.label);
</script>

<template>
  <div class="ak-flex ak-wrap ak-gap-3 ak-items-start">
    <AkDropdown :options="actions" @select="(_, o) => (last = o.label)">
      <AkButton>页面操作 ▾</AkButton>
    </AkDropdown>
    <!-- value：单选菜单，当前项高亮、打开时焦点落在它上面 -->
    <AkDropdown :options="langs" :value="lang" label="语音语种" @select="k => (lang = String(k))">
      <AkButton variant="ghost">语种：{{ langLabel }} ▾</AkButton>
    </AkDropdown>
    <span v-if="last" class="ak-fs-sm ak-fg-muted ak-py-2">选了「{{ last }}」</span>
  </div>
</template>
