import type { Meta, StoryObj } from "@storybook/vue3-vite";

import { asset } from "../../demo/asset";
import { demo } from "../../demo/story";
import AkCountdown from "./AkCountdown.vue";
import AkEvent from "./AkEvent.vue";
import CardsDemo from "./demos/Cards.vue";
import CountdownDemo from "./demos/Countdown.vue";

const meta = {
  title: "Arknights/Event",
  component: AkEvent,
  subcomponents: { AkCountdown },
  tags: ["autodocs"],
  args: {
    title: "奇象巡展",
    kind: "限时活动 · 进行中",
    time: "2026.08.08 16:00 — 09.07 03:59",
    cover: asset("mainpage/banner-qixiang.jpg"),
    status: "live",
  },
  argTypes: {
    status: { control: "inline-radio", options: ["default", "live", "ended"] },
  },
  render: args => ({
    components: { AkEvent, AkCountdown },
    setup: () => ({ args, until: Date.now() + (3 * 24 + 14) * 36e5 + 27.5 * 6e4 }),
    template: '<div class="ak-max-narrow"><AkEvent v-bind="args"><AkCountdown class="ak-mt-2" :until="until" /></AkEvent></div>',
  }),
} satisfies Meta<typeof AkEvent>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};
export const Cards: Story = { name: "活动卡", ...demo(CardsDemo) };
export const Countdown: Story = { name: "倒计时", ...demo(CountdownDemo) };
