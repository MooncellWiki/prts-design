<script setup lang="ts">
/* 手写正文时不必拼游戏标记：variant 包一层 */
import AkRichText from "../AkRichText.vue";

const tip = "晕眩：无法移动、阻挡、攻击及使用技能";
</script>

<template>
  <ul class="ak-m-0">
    <li>进驻会客室时，线索搜集速度提升<AkRichText variant="vup">25%</AkRichText></li>
    <li>攻击范围内的敌人防御力<AkRichText variant="vdown">-30%</AkRichText></li>
    <li>造成相当于攻击力 410% 的<AkRichText variant="rem">物理</AkRichText>和<AkRichText variant="rem">法术</AkRichText>伤害</li>
    <li>令命中目标<AkRichText variant="term" :tip="tip">晕眩</AkRichText>1.5秒</li>
    <li><AkRichText variant="imp">注意：</AkRichText>本关卡无法撤退</li>
  </ul>
</template>
