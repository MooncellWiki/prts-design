<script setup lang="ts">
/**
 * 作用域根：组件的排版基线（字体 / 字号 / 行高 / 前景色）挂在这一层，不靠宿主页面的 body 继承——prts.wiki 上别的皮肤（Vector 2022 …）、
 * 站外页面里，widget 的根节点包一层，就和 AKDS 皮肤上看起来一样；theme 让这一块局部走终端（暗）/ 档案（亮）配色。
 * AKDS 皮肤上 body.skin-arknights 本身就是作用域，包不包都一样。样式在 CSS 实现的 scope.css（= class="ak-scope"）。
 */
withDefaults(
  defineProps<{
    /** 局部主题：dark 终端 · light 档案（连画布底色一起换）；不传 = 跟随宿主页面（html 上的 clientpref 类 / data-theme，都没有就跟随系统） */
    theme?: "light" | "dark";
    /** 根元素标签 */
    tag?: string;
  }>(),
  { theme: undefined, tag: "div" },
);

defineSlots<{
  /** 作用域里的内容：widget 的整棵组件树 */
  default?: () => unknown;
}>();
</script>

<template>
  <component :is="tag" class="ak-scope" :data-theme="theme"><slot /></component>
</template>
