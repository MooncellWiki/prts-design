<script setup lang="ts">
import { computed, provide, useId } from "vue";

import { voiceListKey, type VoiceLanguage, type VoiceText } from "./context";

/**
 * 语音列表（= 现网 {{:xx/语音记录}} 的 VoiceTable）：若干 AkVoice，外框 + 悬停行底色。
 * 上方最多两排切换条（.ak-voice-toolbar 里排一行，放不下时后一排整组换行）：
 *   - texts：文本（台词的语言），多选、可以一个都不选，v-model:shown-texts；AkVoice 的 text 按文本键给对象，选中的几种一种一行
 *   - languages：语种（音频差分，普通话 / 方言 / 日 / 英 / 韩，带 CV 名），单选，v-model；AkVoice 的 src 按语种键给对象
 * 每排的芯片包在 .ak-voice-langs__opts 里：标签单独占左边一列，芯片多到折行时（手机上的「中文 日文 英文 韩文 中文-方言」）折下去的行和第一行左对齐，不排到标签底下。
 * 只给 languages 时 AkVoice 的 text 也按语种给，切语种同时换台词和音频地址。
 * 当前语种 / 选中的文本经 provide 给子项；播放全页只有一条（见 player.ts）。
 * 切换条标 data-no-toggle：皮肤脚本会在 document 上替模板输出的纯 CSS 芯片翻 is-active / aria-pressed，这里的状态归 Vue 管，
 * 不退出那层委托就会两边各翻一次（点第二下反而取消选中）。
 */
const props = withDefaults(
  defineProps<{
    /** 语种选项 { value, label, cv? }（同 Naive 的 options）；不给就没有语种切换条 */
    languages?: VoiceLanguage[];
    /** 文本语言选项 { value, label }；不给就没有文本切换条，台词跟语种走 */
    texts?: VoiceText[];
  }>(),
  { languages: () => [], texts: () => [] },
);

/** 当前语种（languages 里的 value）；不绑定时是第一个 */
const lang = defineModel<string>();
/** 选中的文本语言（texts 里的 value，可多个、可为空）；不绑定时默认第一个 */
const shownTexts = defineModel<string[]>("shownTexts");

defineSlots<{
  /** 若干 AkVoice */
  default?: () => unknown;
  /** 语种切换条末尾的附注（「灰标 = 游戏内解锁条件」） */
  "header-extra"?: () => unknown;
}>();

const current = computed(() => lang.value ?? props.languages[0]?.value);
const shown = computed(() => shownTexts.value ?? (props.texts[0] ? [props.texts[0].value] : []));
function toggleText(value: string) {
  const on = !shown.value.includes(value);
  shownTexts.value = props.texts.map(t => t.value).filter(v => (v === value ? on : shown.value.includes(v)));
}

provide(
  voiceListKey,
  computed(() => ({ lang: current.value, languages: props.languages, texts: props.texts, shownTexts: shown.value })),
);

const id = useId();
</script>

<template>
  <div>
    <div v-if="texts.length || languages.length" class="ak-voice-toolbar ak-not-prose" data-no-toggle>
      <div v-if="texts.length" class="ak-voice-langs" role="group" :aria-labelledby="`${id}-texts`">
        <span :id="`${id}-texts`" class="ak-overline">文本</span>
        <div class="ak-voice-langs__opts">
          <button
            v-for="t in texts"
            :key="t.value"
            type="button"
            :class="['ak-chip', { 'is-active': shown.includes(t.value) }]"
            :aria-pressed="shown.includes(t.value)"
            @click="toggleText(t.value)"
          >
            {{ t.label }}
          </button>
        </div>
      </div>
      <div v-if="languages.length" class="ak-voice-langs" role="group" :aria-labelledby="`${id}-langs`">
        <span :id="`${id}-langs`" class="ak-overline">语种</span>
        <div class="ak-voice-langs__opts">
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
      </div>
    </div>
    <div class="ak-voice-list ak-not-prose"><slot /></div>
  </div>
</template>
