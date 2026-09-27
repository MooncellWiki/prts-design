<script setup lang="ts">
import AkVoice from "../AkVoice.vue";
import AkVoiceList from "../AkVoiceList.vue";

const src = (code: string) => `https://torappu.prts.wiki/assets/audio/voice_cn/char_010_chen/${code}.mp3`;
</script>

<template>
  <!-- 不给 languages：没有切换条，text / src 直接写串，lang 只用来出徽标 -->
  <AkVoiceList>
    <AkVoice title="任命助理" lang="cn" text="博士，现在起由我担任你的护卫。" :src="src('cn_001')" />
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
