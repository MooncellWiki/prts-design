<script setup lang="ts">
import { asset } from "../../../demo/asset";
import AkElite from "../AkElite.vue";
</script>

<template>
  <div class="ak-flex ak-flex-col ak-gap-3">
    <!-- 精英化材料表的行头 -->
    <div class="ak-flex ak-wrap ak-gap-4 ak-items-center">
      <AkElite :src="asset('elite/elite_1.png')" text="提升至精英阶段 1 等级 1" />
      <AkElite :src="asset('elite/elite_2.png')" text="提升至精英阶段 2 等级 1" />
    </div>
    <!-- 专精材料表的行头：同一枚组件换专精小图标 -->
    <div class="ak-flex ak-wrap ak-gap-4 ak-items-center">
      <AkElite :src="asset('specialized/specialized_tiny_1.png')" text="专精 Ⅰ" />
      <AkElite :src="asset('specialized/specialized_tiny_2.png')" text="专精 Ⅱ" />
      <AkElite :src="asset('specialized/specialized_tiny_3.png')" text="专精 Ⅲ" />
    </div>
    <!-- 天赋表的条件列：阶段之后接模组条件（写在组件外） -->
    <div class="ak-flex ak-wrap ak-gap-4 ak-items-center">
      <span><AkElite :src="asset('elite/elite_2.png')" :phase="2" /> · X模组 2级</span>
      <span><AkElite :src="asset('elite/elite_2.png')" :phase="2" /> · Y模组 3级</span>
    </div>
  </div>
</template>
