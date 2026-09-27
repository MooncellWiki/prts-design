<script setup lang="ts">
/** 面包屑的一项（= Naive 的 NBreadcrumbItem），只能放在 AkBreadcrumb 里 */
defineProps<{
  /** 链接地址；不写就是纯文字（当前页一般不写） */
  href?: string;
  /** 当前页：aria-current="page" + 加粗。一项都没写时 AkBreadcrumb 自动把最后一项当作当前页 */
  current?: boolean;
}>();

defineSlots<{
  /** 文字；要用路由链接（RouterLink）时整个写在这里、不写 href */
  default?: () => unknown;
}>();
</script>

<template>
  <li :aria-current="current && !href ? 'page' : undefined">
    <a v-if="href" :href="href" :aria-current="current ? 'page' : undefined"><slot /></a>
    <slot v-else />
  </li>
</template>
