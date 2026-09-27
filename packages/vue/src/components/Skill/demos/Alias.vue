<script setup lang="ts">
import { asset } from "../../../demo/asset";
import AkSkill from "../AkSkill.vue";

/** 陈的三个技能：干员页全等级表的表头卡——技能名后跟英 / 日名，右侧是开放条件 */
const skills = [
  { name: "鞘击", en: "Sheathed Strike", ja: "鞘打ち", trigger: "auto", unlock: "技能1 · 精英零开放" },
  { name: "赤霄·拔刀", en: "Chi Xiao · Unsheath", ja: "赤霄・抜刀", trigger: "manual", unlock: "技能2 · 精英一开放" },
  { name: "赤霄·绝影", en: "Chi Xiao · Shadowless", ja: "赤霄・絶影", trigger: "manual", unlock: "技能3 · 精英二开放" },
] as const;
</script>

<template>
  <div class="ak-flex-col ak-gap-3">
    <AkSkill
      v-for="(s, i) in skills"
      :key="s.name"
      :name="s.name"
      :alias="{ en: s.en, ja: s.ja }"
      :icon="asset(`skill/chen_${i + 1}.png`)"
      sp-type="attack"
      :trigger="s.trigger"
      :unlock="s.unlock"
      :unlock-icon="asset(`elite/elite_${i}.png`)"
    />
  </div>
</template>
