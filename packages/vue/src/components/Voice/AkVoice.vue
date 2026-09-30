<script setup lang="ts">
import { computed, inject, onBeforeUnmount } from "vue";

import AkIcon from "../Icon/AkIcon.vue";
import { HTML_LANG, voiceListKey } from "./context";
import { playing, stop, toggle } from "./player";

/**
 * 一条语音：播放钮 + 标题行（语种徽标 / 解锁条件 / 编号 / 下载）+ 台词。一般放在 AkVoiceList 里，跟列表的语种走。
 * 播放钮标 data-no-toggle：皮肤脚本会在 document 上替模板输出的纯 CSS 播放钮翻 is-playing（演示用），这里的 is-playing 跟真实播放状态走，
 * 不退出那层委托就会两边各翻一次（点一下在放但图标还是播放，再点停了图标却变成暂停）。
 */
const props = withDefaults(
  defineProps<{
    /** 语音标题（任命助理 / 交谈1 …） */
    title: string;
    /** 台词：一个串，或按语种的对象 { cn, jp, en, kr, yue }（取当前语种，缺了退回第一项） */
    text: string | Record<string, string>;
    /** 音频地址：一个串，或按语种的对象（同 text）；取不到时播放钮禁用 */
    src?: string | Record<string, string>;
    /** 语音编号（CN_001），标题行里的小字 */
    code?: string;
    /** 游戏内解锁条件（提升至精英阶段1以查看），标题行里的灰标 */
    unlock?: string;
    /** 语种键：不在 AkVoiceList 里时用它取 text / src、显示徽标；在列表里时跟列表的 v-model */
    lang?: string;
    /** 下载地址（现网是 torappu 的 wav）：一个串，或按语种的对象（同 src）；给了就在标题行右端出一枚下载图标 */
    download?: string | Record<string, string>;
    /** 下载存成的文件名（<a download> 的值，任命助理.wav）；不写由浏览器按地址定 */
    downloadName?: string;
  }>(),
  { src: undefined, code: undefined, unlock: undefined, lang: undefined, download: undefined, downloadName: undefined },
);

const list = inject(voiceListKey, undefined);
const lang = computed(() => props.lang ?? list?.value.lang);

function pick(v: string | Record<string, string> | undefined) {
  if (v === undefined || typeof v === "string") return v;
  return (lang.value !== undefined ? v[lang.value] : undefined) ?? Object.values(v)[0];
}
const text = computed(() => pick(props.text));
const src = computed(() => pick(props.src));
const download = computed(() => pick(props.download));
const badge = computed(() => {
  const k = lang.value;
  return k && (list?.value.languages.find(l => l.value === k)?.badge ?? k.toUpperCase());
});

const id = Symbol("AkVoice");
const isPlaying = computed(() => playing.value === id);
onBeforeUnmount(() => isPlaying.value && stop());

function onClick() {
  if (src.value) toggle(id, src.value);
}
</script>

<template>
  <div class="ak-voice">
    <button
      type="button"
      :class="['ak-voice__play', { 'is-playing': isPlaying }]"
      :aria-label="`播放 ${title}`"
      :aria-pressed="isPlaying"
      :disabled="!src"
      data-no-toggle
      @click="onClick"
    />
    <div>
      <div class="ak-voice__title">
        {{ title }}
        <span v-if="badge" class="ak-voice__lang">{{ badge }}</span>
        <span v-if="unlock" class="ak-voice__cond">{{ unlock }}</span>
        <span v-if="code" class="ak-code-id">{{ code }}</span>
        <span v-if="isPlaying" class="ak-voice__wave" aria-hidden="true"><i v-for="n in 5" :key="n" /></span>
        <a v-if="download" class="ak-voice__download" :href="download" :download="downloadName ?? ''" :aria-label="`下载 ${title}`" :title="`下载 ${title}`">
          <AkIcon name="download" :size="16" />
        </a>
      </div>
      <div class="ak-voice__text" :lang="lang && HTML_LANG[lang]">{{ text }}</div>
    </div>
  </div>
</template>
