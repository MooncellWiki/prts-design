<script setup lang="ts">
import AkButton from "../../Button/AkButton.vue";
import AkDropdown from "../AkDropdown.vue";
import type { DropdownMixedOption } from "../types";

// = 页面动作簇的「更多」：两组 MW 门户（操作 #p-cactions · 工具 #p-tb），项是链接
const more: DropdownMixedOption[] = [
  {
    type: "group",
    label: "操作",
    children: [
      { key: "ca-move", label: "移动", icon: "move", href: "#" },
      { key: "ca-protect", label: "保护", icon: "lock", href: "#" },
      { key: "ca-delete", label: "删除", icon: "trash", href: "#" },
      { key: "ca-purge", label: "刷新", icon: "refresh", href: "#" },
    ],
  },
  {
    type: "group",
    label: "工具",
    children: [
      { key: "t-whatlinkshere", label: "链入页面", icon: "linkin", href: "#" },
      { key: "t-recentchangeslinked", label: "相关更改", icon: "list", href: "#" },
      { key: "t-permalink", label: "固定链接", icon: "link", href: "#" },
      { key: "t-info", label: "页面信息", icon: "info", href: "#" },
    ],
  },
];
</script>

<template>
  <!-- 触发按钮靠右，菜单用 bottom-end 右对齐 -->
  <div class="ak-flex ak-justify-end ak-items-start">
    <AkDropdown :options="more" placement="bottom-end">
      <AkButton icon="more" variant="ghost">更多</AkButton>
    </AkDropdown>
  </div>
</template>
