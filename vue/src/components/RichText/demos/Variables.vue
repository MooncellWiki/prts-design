<script setup lang="ts">
import AkRichText from "../AkRichText.vue";

/** 陈 · 鞘击：技能描述模板（skill_table 原样）+ 各级的 blackboard */
const template =
  "下次攻击使用刀鞘砸向敌人，造成相当于攻击力<@ba.vup>{atk_scale:0%}</>的物理伤害，令命中目标<$ba.stun>晕眩</><@ba.vup>{stun}</>秒";
const terms = { "ba.stun": "晕眩：无法移动、阻挡、攻击及使用技能" };
</script>

<template>
  <div class="ak-flex-col ak-gap-2">
    <p class="ak-m-0"><b>1 级</b>　<AkRichText :text="template" :vars="{ atk_scale: 2, stun: 1 }" :terms="terms" /></p>
    <p class="ak-m-0"><b>7 级</b>　<AkRichText :text="template" :vars="{ atk_scale: 2.6, stun: 1.5 }" :terms="terms" /></p>
    <p class="ak-m-0"><b>专精 Ⅲ</b>　<AkRichText :text="template" :vars="{ atk_scale: 3.2, stun: 1.5 }" :terms="terms" /></p>
    <p class="ak-m-0 ak-fg-muted ak-fs-sm">没给取值的占位符原样留着：<AkRichText :text="template" :terms="terms" /></p>
  </div>
</template>
