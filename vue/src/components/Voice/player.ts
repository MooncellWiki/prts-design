import { shallowRef } from "vue";

/**
 * 全页共用一个原生 Audio：同一时间只放一条语音——点另一条先停掉正在放的（同现网 VoiceTable / 干员页脚本）。
 * 第一次点播放时才创建，SSR / 预渲染不碰 Audio。playing 是正在放的那条 AkVoice 的标识。
 */
export const playing = shallowRef<symbol | null>(null);
let audio: HTMLAudioElement | undefined;

export function stop() {
  audio?.pause();
  playing.value = null;
}

/** 放 / 停一条：正在放的就是它 → 停；否则停掉别的、换成它 */
export function toggle(id: symbol, src: string) {
  if (playing.value === id) return stop();
  if (!audio) {
    audio = new Audio();
    audio.addEventListener("ended", stop);
    audio.addEventListener("error", stop);
  }
  audio.pause();
  audio.src = src;
  playing.value = id;
  // 播放被拒（自动播放策略 / 很快又点了别的条目打断了加载）：只在还是这条时复位
  audio.play().catch(() => {
    if (playing.value === id) playing.value = null;
  });
}
