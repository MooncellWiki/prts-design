<script setup lang="ts">
import { asset } from "../../../demo/asset";
import AkTag from "../../Tag/AkTag.vue";
import AkModule from "../AkModule.vue";
</script>

<template>
  <!-- 原型证章：不写 color（灰条）、短文全文展开不出开关、没有阶段表 -->
  <AkModule name="陈证章" :src="asset('subprofession/sword.png')" type-name="Original" :collapsible="false">
    <template #header-extra>
      <AkTag size="sm" variant="outline">基础证章 · 无特殊效果 · STAGE MAX</AkTag>
    </template>
    <p>干员陈擅长于近身搏斗中对敌人造成多段杀伤<br />根据外勤部门决议<br />在外勤任务中划分为近卫干员，行使剑豪职责<br />特别颁发此证章<br />以兹证明</p>
  </AkModule>
</template>
