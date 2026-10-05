<script setup lang="ts">
import { ref } from "vue";

import type { VoiceLanguage, VoiceText } from "../context";
import AkVoice from "../AkVoice.vue";
import AkVoiceList from "../AkVoiceList.vue";

/** 文本（台词的语言）：多选，可以一个都不选；不绑 v-model:shown-texts 时默认第一个 */
const texts: VoiceText[] = [
  { value: "cn", label: "中文" },
  { value: "jp", label: "日文" },
  { value: "en", label: "英文" },
  { value: "kr", label: "韩文" },
  { value: "yue", label: "中文-方言" },
];
const shown = ref(["cn"]);

/** 语种（音频差分）：单选，带 CV 名；只换音频 */
const languages: VoiceLanguage[] = [
  { value: "jp", label: "日语", cv: "石上静香" },
  { value: "cn", label: "中文-普通话", cv: "虫虫" },
  { value: "yue", label: "中文-方言", cv: "包少爷" },
  { value: "kr", label: "韩语", cv: "郑侑廷" },
  { value: "en", label: "英语", cv: "Amy Lennox" },
];
const lang = ref("jp");
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
  { code: "CN_005", title: "晋升后交谈1", unlock: "提升至精英阶段1以查看", text: { cn: "龙门的大街小巷我都走过。码头、招牌、坡道，那些风景印在我的心上。我永远都不会忘记。", yue: "龙门的每一条街道每一条巷子我都行过。码头、招牌、斜坡，那些风景已经全部进了我的心。我永远都会记得。", jp: "龍門の街じゅう、いたる所に足を運んだ。港、街中の看板や坂道……心に刻まれたこの街の風景を、私はいつまでも忘れることはないだろう。", en: "I know every nook and cranny in Lungmen. The docks, the neon signs, the winding paths, I can see them all in my mind, clear as day. I'll never forget them.", kr: "용문 거리를 여기저기 돌아다녔다. 항구, 길거리의 간판이나 언덕길…… 마음속 깊이 새겨진 이 도시의 풍경을, 난 영원히 잊지 못하겠지." } },
  { code: "CN_034", title: "戳一下", text: { cn: "喂！干什么呢！", yue: "喂！做咩啊！", jp: "おい！何をする！", en: "Hey! What are you doing!", kr: "어이! 뭐하는 거야!" } },
];
</script>

<template>
  <AkVoiceList v-model="lang" v-model:shown-texts="shown" :languages="languages" :texts="texts">
    <AkVoice v-for="v in voices" :key="v.code" :title="v.title" :unlock="v.unlock" :text="v.text" :src="audio(v.code)" />
  </AkVoiceList>
</template>
