<script setup lang="ts">
import { computed, provide, useId } from "vue";

import { voiceListKey, type VoiceLanguage } from "./context";

/**
 * 语音列表（= 现网 {{:xx/语音记录}} 的 VoiceTable）：若干 AkVoice，外框 + 悬停行底色。
 * 给了 languages 就在上方出一排语种切换（普通话 / 方言 / 日 / 英 / 韩，带 CV 名）；切语种只换台词、徽标和音频地址。
 * 当前语种经 provide 给子项；播放全页只有一条（见 player.ts）。
 * 切换条标 data-no-toggle：皮肤脚本会在 document 上替模板输出的纯 CSS 芯片翻 is-active / aria-pressed，这里的状态归 Vue 管，
 * 不退出那层委托就会两边各翻一次（点第二下反而取消选中）。
 */
const props = withDefaults(
  defineProps<{
    /** 语种选项 { value, label, badge?, cv? }（同 Naive 的 options）；不给就不出切换条 */
    languages?: VoiceLanguage[];
  }>(),
  { languages: () => [] },
);

/** 当前语种（languages 里的 value）；不绑定时是第一个 */
const lang = defineModel<string>();

defineSlots<{
  /** 若干 AkVoice */
  default?: () => unknown;
  /** 切换条末尾的附注（「共 38 条 · 灰标 = 游戏内解锁条件」） */
  "header-extra"?: () => unknown;
}>();

const current = computed(() => lang.value ?? props.languages[0]?.value);
provide(
  voiceListKey,
  computed(() => ({ lang: current.value, languages: props.languages })),
);

const id = useId();
</script>

<template>
  <div>
    <div v-if="languages.length" class="ak-voice-langs ak-not-prose" role="group" :aria-labelledby="`${id}-langs`" data-no-toggle>
      <span :id="`${id}-langs`" class="ak-overline">语种</span>
      <button
        v-for="l in languages"
        :key="l.value"
        type="button"
        :class="['ak-chip', { 'is-active': l.value === current }]"
        :aria-pressed="l.value === current"
        @click="lang = l.value"
      >
        {{ l.label }}<small v-if="l.cv">{{ l.cv }}</small>
      </button>
      <slot name="header-extra" />
    </div>
    <div class="ak-voice-list ak-not-prose"><slot /></div>
  </div>
</template>
