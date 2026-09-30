import type { Meta, StoryObj } from "@storybook/vue3-vite";

import { demo } from "../../demo/story";
import AkVoice from "./AkVoice.vue";
import AkVoiceList from "./AkVoiceList.vue";
import BasicDemo from "./demos/Basic.vue";
import LanguagesDemo from "./demos/Languages.vue";
import SplitDemo from "./demos/Split.vue";

const meta = {
  title: "Arknights/Voice",
  component: AkVoice,
  subcomponents: { AkVoiceList },
  tags: ["autodocs"],
  args: {
    title: "任命助理",
    text: "博士，现在起由我担任你的护卫。",
    src: "https://torappu.prts.wiki/assets/audio/voice_cn/char_010_chen/cn_001.mp3",
    code: "CN_001",
    unlock: "",
    lang: "cn",
    download: "https://torappu.prts.wiki/assets/audio/voice_cn/char_010_chen/cn_001.wav?filename=%E4%BB%BB%E5%91%BD%E5%8A%A9%E7%90%86.wav",
    downloadName: "任命助理.wav",
  },
  render: args => ({
    components: { AkVoice, AkVoiceList },
    setup: () => ({ args }),
    template: '<AkVoiceList><AkVoice v-bind="args" /></AkVoiceList>',
  }),
} satisfies Meta<typeof AkVoice>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};
export const Languages: Story = { name: "语种切换", ...demo(LanguagesDemo) };
export const Split: Story = { name: "文本与语种分开选", ...demo(SplitDemo) };
export const Basic: Story = { name: "单一语种", ...demo(BasicDemo) };
