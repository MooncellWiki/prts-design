<script setup lang="ts">
import { ref } from "vue";

import { asset } from "../../../demo/asset";
import AkSkillLevels from "../AkSkillLevels.vue";

const level = ref(7);
const masteryIcons = [1, 2, 3].map(n => asset(`specialized/specialized_tiny_${n}.png`));

/** 三星及以下没有专精：max=7 */
const lowRarity = ref(4);
/** 没给专精图标时写 M1–M3 */
const noIcons = ref(9);
</script>

<template>
  <div class="ak-flex-col ak-gap-3 ak-items-start">
    <AkSkillLevels v-model="level" :mastery-icons="masteryIcons" />
    <span class="ak-fs-sm ak-fg-muted">当前：{{ level > 7 ? `专精 ${level - 7}` : `${level} 级` }}</span>
    <AkSkillLevels v-model="lowRarity" :max="7" />
    <AkSkillLevels v-model="noIcons" />
  </div>
</template>
