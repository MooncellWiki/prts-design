<script setup lang="ts">
import AkHeading from "../AkHeading.vue";
</script>

<template>
  <div>
    <AkHeading title="怒号光明" en="Chapter 08" stack :level="3" class="ak-mt-0" />
    <AkHeading title="亮点干员">
      <template #extra><a class="ak-chevrons" href="#">干员一览</a></template>
    </AkHeading>
    <AkHeading title="近期新增">
      <template #extra><a class="ak-chevrons" href="#">最近更改</a></template>
    </AkHeading>
  </div>
</template>
