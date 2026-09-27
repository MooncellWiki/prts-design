<script setup lang="ts">
import { asset } from "../../../demo/asset";
import AkKv from "../AkKv.vue";
import AkKvItem from "../AkKvItem.vue";
</script>

<template>
  <!-- 干员页「特性」：带框的信息栏，键列居中 -->
  <AkKv bordered>
    <AkKvItem term="分支">
      <span class="ak-prof-label">
        <span class="ak-subprof"><img :src="asset('subprofession/sword.png')" alt="" /></span>
        <a href="#">剑豪</a> <span class="ak-en">Swordmaster</span>
      </span>
    </AkKvItem>
    <AkKvItem term="描述">普通攻击连续造成<span class="ak-rt-kw">两次</span>伤害</AkKvItem>
    <AkKvItem term="分支信息">
      <ul>
        <li>可以且优先攻击自身阻挡的单位（即使目标处于攻击范围外或为飞行单位）。</li>
      </ul>
    </AkKvItem>
  </AkKv>
</template>
