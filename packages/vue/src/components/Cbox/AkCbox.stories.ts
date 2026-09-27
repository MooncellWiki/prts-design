import type { Meta, StoryObj } from "@storybook/vue3-vite";

import { demo } from "../../demo/story";
import { icons } from "../../icons";
import AkCbox from "./AkCbox.vue";
import LevelsDemo from "./demos/Levels.vue";
import NarrowDemo from "./demos/Narrow.vue";

const meta = {
  title: "Components/Cbox",
  component: AkCbox,
  tags: ["autodocs"],
  args: { level: "tip", title: "" },
  argTypes: {
    level: { control: "inline-radio", options: ["tip", "info", "warning", "danger", "neutral"] },
    icon: { control: "select", options: [undefined, ...Object.keys(icons)] },
  },
  render: args => ({
    components: { AkCbox },
    setup: () => ({ args }),
    template: '<AkCbox v-bind="args">如需了解<b>所有干员的上线时间</b>，可查阅<a href="#">干员上线时间一览</a>页面。</AkCbox>',
  }),
} satisfies Meta<typeof AkCbox>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};
export const Levels: Story = { name: "等级（lv0–4）", ...demo(LevelsDemo) };
export const Narrow: Story = { name: "窄版", ...demo(NarrowDemo) };
