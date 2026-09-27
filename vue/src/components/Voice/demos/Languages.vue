<script setup lang="ts">
import { ref } from "vue";

import type { VoiceLanguage } from "../context";
import AkVoice from "../AkVoice.vue";
import AkVoiceList from "../AkVoiceList.vue";

const languages: VoiceLanguage[] = [
  { value: "cn", label: "中文-普通话", badge: "CN", cv: "虫虫" },
  { value: "yue", label: "中文-方言", badge: "粤", cv: "包少爷" },
  { value: "jp", label: "日文", badge: "JP", cv: "石上静香" },
  { value: "en", label: "英文", badge: "EN", cv: "Amy Lennox" },
  { value: "kr", label: "韩文", badge: "KR", cv: "郑侑廷" },
];
const lang = ref("cn");

/** 现网同源音频（与干员页 / VoiceTable 同一套地址）：torappu.prts.wiki/assets/audio/<语种目录>/<charId>/<编号>.mp3 */
const DIR: Record<string, string> = {
  cn: "voice_cn/char_010_chen",
  yue: "voice_custom/char_010_chen_cn_topolect",
  jp: "voice/char_010_chen",
  en: "voice_en/char_010_chen",
  kr: "voice_kr/char_010_chen",
};
const audio = (code: string) =>
  Object.fromEntries(
    Object.entries(DIR).map(([k, d]) => [k, `https://torappu.prts.wiki/assets/audio/${d}/${code.toLowerCase()}.mp3`]),
  );

const voices = [
  { code: "CN_001", title: "任命助理", text: { cn: "博士，现在起由我担任你的护卫。", yue: "博士，接下来就由我担任你的护卫。", jp: "ドクター、これよりキミの護衛を担当させてもらう。", en: "I will be your bodyguard, Doctor.", kr: "박사, 지금부터 너의 호위를 담당하겠다." } },
  { code: "CN_002", title: "交谈1", text: { cn: "我一直觉得你们罗德岛很可疑，现在也一样。", yue: "我一向都觉得你们罗德岛很可疑，现在这一刻也是这么觉得。", jp: "ロドスの動向については、ずっと不審に感じているところがある。もちろん、今でもだ。", en: "I've always had my suspicions about Rhodes Island. Still do.", kr: "로도스 아일랜드의 동향은 계속 수상하다 여기고 있어. 물론 지금도 마찬가지다." } },
  { code: "CN_003", title: "交谈2", text: { cn: "你怎么还在盯着我看？你的工作呢？", yue: "你怎么还在看着我？你手头要做的的东西呢？", jp: "なぜこちらをじっと見ている？仕事はどうしたんだ？", en: "Why are you staring at me? Nothing better to do?", kr: "뭘 그렇게 뚫어져라 쳐다보고 있는 거지? 일할 시간 아닌가?" } },
  { code: "CN_005", title: "晋升后交谈1", unlock: "提升至精英阶段1以查看", text: { cn: "龙门的大街小巷我都走过。码头、招牌、坡道，那些风景印在我的心上。我永远都不会忘记。", yue: "龙门的每一条街道每一条巷子我都行过。码头、招牌、斜坡，那些风景已经全部进了我的心。我永远都会记得。", jp: "龍門の街じゅう、いたる所に足を運んだ。港、街中の看板や坂道……心に刻まれたこの街の風景を、私はいつまでも忘れることはないだろう。", en: "I know every nook and cranny in Lungmen. The docks, the neon signs, the winding paths, I can see them all in my mind, clear as day. I'll never forget them.", kr: "용문 거리를 여기저기 돌아다녔다. 항구, 길거리의 간판이나 언덕길…… 마음속 깊이 새겨진 이 도시의 풍경을, 난 영원히 잊지 못하겠지." } },
  { code: "CN_007", title: "信赖提升后交谈1", unlock: "提升信赖至40%以查看", text: { cn: "也许有一天我会得到那个人的认可，在那之前......", yue: "或许有一天我会得到那个人的认可，在那天来到之前......", jp: "いつかはあの人に認めてもらえるかもしれない。その時までは……。", en: "Maybe one day that man will take note of my efforts, but until then…", kr: "언젠가는 그 사람에게 인정받을지도 몰라. 그때까지는……" } },
  { code: "CN_010", title: "闲置", text: { cn: "博士？睡着了？哼，真没紧张感。", yue: "博士？睡着了？哼，一点紧张感也冇。", jp: "……ドクター？眠っているのか？ふん、緊張感のないやつだ。", en: "Doctor? You fell asleep? Hmph. No nerves to keep you awake, then.", kr: "……박사? 자고 있는 건가? 흥, 긴장감 없는 녀석이군." } },
  { code: "CN_025", title: "作战中1", text: { cn: "斩！", yue: "斩！", jp: "斬！", en: "Slash!", kr: "참!" } },
  { code: "CN_034", title: "戳一下", text: { cn: "喂！干什么呢！", yue: "喂！做咩啊！", jp: "おい！何をする！", en: "Hey! What are you doing!", kr: "어이! 뭐하는 거야!" } },
];
</script>

<template>
  <AkVoiceList v-model="lang" :languages="languages">
    <template #header-extra><span class="ak-fs-xs ak-fg-muted">灰标 = 游戏内解锁条件 · 切语种只换文本与音频</span></template>
    <AkVoice
      v-for="v in voices"
      :key="v.code"
      :title="v.title"
      :code="v.code"
      :unlock="v.unlock"
      :text="v.text"
      :src="audio(v.code)"
    />
  </AkVoiceList>
</template>
