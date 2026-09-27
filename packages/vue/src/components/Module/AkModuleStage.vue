<script setup lang="ts">
/** 模组三阶段表的一行（阶段条 · 属性加成 · 特性追加 / 天赋更新），放在 AkModule 的 #stages 插槽里 */
defineProps<{
  /** 阶段 1–3：「STAGE n」+ 三段条点亮 n 段 */
  stage: 1 | 2 | 3;
  /** 属性加成：{ 攻击: "+50", 攻击速度: "+5" }（按写的顺序排，数值绿字） */
  stats?: Record<string, string | number>;
  /** 变化类别的反色小标：特性追加 / 天赋更新 */
  kicker?: string;
}>();

defineSlots<{
  /** 特性 / 天赋变化的描述（可带富文本） */
  default?: () => unknown;
}>();
</script>

<template>
  <tr>
    <td class="lv">
      <span class="ak-module__lv">STAGE {{ stage }}<i aria-hidden="true"><b v-for="n in 3" :key="n" :class="{ on: n <= stage }" /></i></span>
    </td>
    <td class="stats">
      <span class="ak-module__stats">
        <span v-for="(v, k) in stats" :key="k">{{ k }} <span class="ak-rt-vup">{{ v }}</span></span>
      </span>
    </td>
    <td><span v-if="kicker" class="ak-module__kicker">{{ kicker }}</span><slot /></td>
  </tr>
</template>
