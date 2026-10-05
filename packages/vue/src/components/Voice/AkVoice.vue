<script setup lang="ts">
import { computed, inject, onBeforeUnmount } from "vue";

import AkIcon from "../Icon/AkIcon.vue";
import { HTML_LANG, voiceListKey } from "./context";
import { playing, stop, toggle } from "./player";

/**
 * 一条语音：播放钮（+ 下载钮）+ 标题 + 解锁条件（另起一行）+ 台词。一般放在 AkVoiceList 里，跟列表的语种走。
 * 不出语音编号（CN_001 这类文件名）：那是内部序号，读者用不上。
 * 解锁条件不和标题挤一行：「游戏内仅在每年1月1日-1月4日显示」这样的长条件在手机上会把标题挤成一列一字、把整页撑宽。
 * 条件和台词包在 .ak-voice__body 里：手机上（<640）标题和播放 / 下载钮排成一行，body 换到下一行占满整宽，台词不用让出按钮那一列。
 * 标题旁不再标语种：当前语种在上面的切换条里，每条再标一遍只是复读，而「方言」这类也没有靠谱的缩写。
 * 播放钮标 data-no-toggle：皮肤脚本会在 document 上替模板输出的纯 CSS 播放钮翻 is-playing（演示用），这里的 is-playing 跟真实播放状态走，
 * 不退出那层委托就会两边各翻一次（点一下在放但图标还是播放，再点停了图标却变成暂停）。
 */
const props = withDefaults(
  defineProps<{
    /** 语音标题（任命助理 / 交谈1 …） */
    title: string;
    /** 台词：一个串；或按语种的对象 { cn, jp, en, kr, yue }（取当前语种，缺了退回第一项）；列表给了 texts 时按文本键的对象（选中的几种一种一行） */
    text: string | Record<string, string>;
    /** 音频地址：一个串，或按语种的对象（同 text）；取不到时播放钮禁用 */
    src?: string | Record<string, string>;
    /** 游戏内解锁 / 显示条件（提升至精英阶段1以查看 · 游戏内仅在每年1月1日-1月4日显示），标题下面单独一行的灰标 */
    unlock?: string;
    /** 语种键：不在 AkVoiceList 里时用它取 text / src、标台词的 HTML lang；在列表里时跟列表的 v-model */
    lang?: string;
    /** 下载地址（现网是 torappu 的 wav）：一个串，或按语种的对象（同 src）；给了就在播放钮旁出一枚同款下载钮 */
    download?: string | Record<string, string>;
    /** 下载存成的文件名（<a download> 的值，任命助理.wav）；不写由浏览器按地址定 */
    downloadName?: string;
  }>(),
  { src: undefined, unlock: undefined, lang: undefined, download: undefined, downloadName: undefined },
);

const list = inject(voiceListKey, undefined);
const lang = computed(() => props.lang ?? list?.value.lang);

function pick(v: string | Record<string, string> | undefined) {
  if (v === undefined || typeof v === "string") return v;
  return (lang.value !== undefined ? v[lang.value] : undefined) ?? Object.values(v)[0];
}
const text = computed(() => {
  const v = props.text;
  if (typeof v === "string" || !list?.value.texts.length) return pick(v);
  return list.value.shownTexts.map(k => v[k]).filter(Boolean).join("\n");
});
const src = computed(() => pick(props.src));
const download = computed(() => pick(props.download));

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
    <a v-if="download" class="ak-voice__download" :href="download" :download="downloadName ?? ''" :aria-label="`下载 ${title}`" :title="`下载 ${title}`">
      <AkIcon name="download" :size="16" />
    </a>
    <div>
      <div class="ak-voice__title">
        {{ title }}
        <span v-if="isPlaying" class="ak-voice__wave" aria-hidden="true"><i v-for="n in 5" :key="n" /></span>
      </div>
      <div class="ak-voice__body">
        <div v-if="unlock" class="ak-voice__cond">{{ unlock }}</div>
        <div class="ak-voice__text" :lang="lang && HTML_LANG[lang]">{{ text }}</div>
      </div>
    </div>
  </div>
</template>
