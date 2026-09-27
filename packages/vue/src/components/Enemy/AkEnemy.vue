<script setup lang="ts">
import { computed } from "vue";

export type EnemyRank = "normal" | "elite" | "boss";

const props = withDefaults(
  defineProps<{
    /** 敌人名 */
    name: string;
    /** 编号（B003 / E020 / N001），显示在级别后面：「BOSS · B003」 */
    code?: string;
    /** 级别（游戏 enemyLevel）：normal 普通 · elite 精英（橙色条）· boss 领袖（红色条）；级别字总会写出来，不只靠色条 */
    variant?: EnemyRank;
    /** 头像地址（方图，裁成 64px 圆）；不写时是深色空圆 */
    src?: string;
    /** 威胁度：点亮几枚菱形 */
    level?: number;
    /** 菱形总数 */
    levelMax?: number;
  }>(),
  { code: undefined, variant: "normal", src: undefined, level: undefined, levelMax: 4 },
);

defineSlots<{
  /** 名字 / 威胁度下面追加的内容（属性、能力摘要） */
  default?: () => unknown;
}>();

const RANK: Record<EnemyRank, string> = { normal: "NORMAL", elite: "ELITE", boss: "BOSS" };

const classes = computed(() => ["ak-enemy", props.variant !== "normal" && `ak-enemy--${props.variant}`]);
const codeText = computed(() => [RANK[props.variant], props.code].filter(Boolean).join(" · "));
</script>

<template>
  <div :class="classes">
    <img v-if="src" class="ak-enemy__img" :src="src" alt="" />
    <div v-else class="ak-enemy__img" />
    <div>
      <div class="ak-enemy__code">{{ codeText }}</div>
      <div class="ak-enemy__name">{{ name }}</div>
      <div v-if="level !== undefined" class="ak-enemy__level" role="img" :aria-label="`威胁度 ${level} / ${levelMax}`">
        <i v-for="n in levelMax" :key="n" :class="{ on: n <= level }" />
      </div>
      <slot />
    </div>
  </div>
</template>
