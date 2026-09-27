<script setup lang="ts">
import { asset } from "../../../demo/asset";
import AkTag from "../../Tag/AkTag.vue";
import AkSkill from "../AkSkill.vue";

/* 未解锁：图标灰化 + 锁；SP 类型色见图标描边与底部色条（绿 = 自动回复） */
</script>

<template>
  <AkSkill name="真银斩" :icon="asset('skill/svrash_3.png')" sp-type="auto" trigger="manual" :cost="40" :init="20" :duration="25" locked>
    <template #header-extra><AkTag variant="outline" size="sm">未解锁</AkTag></template>
    攻击范围扩大，攻击力提升，攻击时同时攻击范围内的多名敌人
  </AkSkill>
</template>
