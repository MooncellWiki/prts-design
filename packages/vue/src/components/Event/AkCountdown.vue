<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref, watch } from "vue";

const props = withDefaults(
  defineProps<{
    /** 截止时刻（ISO 串 / 时间戳 / Date），按当前时间实时倒数——活动、卡池、周常刷新都用它 */
    until?: string | number | Date;
    /** 或者给剩余毫秒数，从挂载时起倒数（同 Naive 的 NCountdown）；有 until 时忽略 */
    duration?: number;
    /** 是否走字；false 时停在当前读数（duration 模式下恢复后接着倒数） */
    active?: boolean;
    /** 最小单位：min 到分（默认，每分钟刷新）· sec 到秒 */
    precision?: "min" | "sec";
    /** 最多显示几格，从最大的单位数起：2 → 「03 days 14 hrs」/ 不足一天时「14 hrs 27 min」（首页幻灯片）；不写则一直显示到 precision */
    parts?: number;
  }>(),
  { until: undefined, duration: undefined, active: true, precision: "min", parts: undefined },
);

const emit = defineEmits<{
  /** 倒数到 0（之后整个倒计时不再渲染） */
  finish: [];
}>();

const initial = () => (props.until !== undefined ? new Date(props.until).getTime() - Date.now() : (props.duration ?? 0));

/** 剩余毫秒；到点或无效日期（NaN）时不渲染 */
const remaining = ref(initial());
/** 走字时的截止时间戳 */
let endAt = 0;
let timer: ReturnType<typeof setTimeout> | undefined;

/** 下一次读数变化时再醒：到分时最多一分钟一次，不每秒重渲染 */
function schedule() {
  clearTimeout(timer);
  if (!props.active || !(remaining.value > 0)) return;
  const unit = props.precision === "sec" ? 1e3 : 6e4;
  timer = setTimeout(tick, (remaining.value % unit || unit) + 20);
}
function tick() {
  const was = remaining.value;
  remaining.value = endAt - Date.now();
  if (was > 0 && !(remaining.value > 0)) emit("finish");
  schedule();
}
function start() {
  endAt = props.until !== undefined ? new Date(props.until).getTime() : Date.now() + remaining.value;
  tick();
}
/** 停下时把读数补到此刻：duration 模式恢复后从这里接着倒数，不丢上一次刷新以来走掉的时间 */
function stop() {
  clearTimeout(timer);
  if (endAt) remaining.value = endAt - Date.now();
}

onMounted(() => props.active && start());
onBeforeUnmount(() => clearTimeout(timer));
watch(
  () => props.active,
  on => (on ? start() : stop()),
);
watch([() => props.until, () => props.duration], () => {
  remaining.value = initial();
  if (props.active) start();
});

const UNITS = [
  { ms: 864e5, mod: Infinity, unit: "days", zh: "天" },
  { ms: 36e5, mod: 24, unit: "hrs", zh: "小时" },
  { ms: 6e4, mod: 60, unit: "min", zh: "分" },
  { ms: 1e3, mod: 60, unit: "sec", zh: "秒" },
] as const;

/** 不足一天时从「时」起（时总会显示，00 也显示）；到 precision 为止，再按 parts 截断 */
const cells = computed(() => {
  const ms = Math.max(0, remaining.value);
  const all = UNITS.map(u => ({ ...u, value: Math.floor(ms / u.ms) % u.mod }));
  const shown = all.slice(all[0].value ? 0 : 1, props.precision === "sec" ? 4 : 3);
  return props.parts ? shown.slice(0, props.parts) : shown;
});
const spoken = computed(() => `剩余 ${cells.value.map(c => `${c.value} ${c.zh}`).join(" ")}`);
const pad2 = (n: number) => String(n).padStart(2, "0");
</script>

<template>
  <!-- role="timer"（隐式 aria-live=off，不会每分钟打断读屏）；读数是英文单位，读屏名给中文 -->
  <span v-if="remaining > 0" class="ak-countdown" role="timer" :aria-label="spoken">
    <span v-for="c in cells" :key="c.unit" aria-hidden="true"><b>{{ pad2(c.value) }}</b><small>{{ c.unit }}</small></span>
  </span>
</template>
