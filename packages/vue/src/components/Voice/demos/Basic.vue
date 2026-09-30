<script setup lang="ts">
import AkVoice from "../AkVoice.vue";
import AkVoiceList from "../AkVoiceList.vue";

const src = (code: string) => `https://torappu.prts.wiki/assets/audio/voice_cn/char_010_chen/${code}.mp3`;
/** 下载给 wav 原文件；?filename= 是现网 VoiceTable 的约定，服务端据此写 Content-Disposition */
const wav = (code: string, name: string) =>
  `https://torappu.prts.wiki/assets/audio/voice_cn/char_010_chen/${code}.wav?filename=${encodeURIComponent(name)}.wav`;
</script>

<template>
  <!-- 不给 languages：没有切换条，text / src 直接写串，lang 只用来出徽标；download 出下载图标 -->
  <AkVoiceList>
    <AkVoice
      title="任命助理"
      lang="cn"
      text="博士，现在起由我担任你的护卫。"
      :src="src('cn_001')"
      :download="wav('cn_001', '任命助理')"
      download-name="任命助理.wav"
    />
    <AkVoice
      title="晋升后交谈1"
      lang="cn"
      unlock="提升至精英阶段1以查看"
      text="龙门的大街小巷我都走过。码头、招牌、坡道，那些风景印在我的心上。我永远都不会忘记。"
      :src="src('cn_005')"
    />
    <AkVoice title="标题" text="明日方舟。" />
  </AkVoiceList>
</template>
