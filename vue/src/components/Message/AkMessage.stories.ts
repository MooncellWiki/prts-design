import type { Meta, StoryObj } from "@storybook/vue3-vite";

import { demo } from "../../demo/story";
import { icons } from "../../icons";
import AkMessage from "./AkMessage.vue";
import BannerDemo from "./demos/Banner.vue";
import ClosableDemo from "./demos/Closable.vue";
import VariantsDemo from "./demos/Variants.vue";

const meta = {
  title: "Components/Message",
  component: AkMessage,
  tags: ["autodocs"],
  args: { variant: "info", title: "信息", showIcon: true, closable: true, banner: false, stripes: false },
  argTypes: {
    variant: { control: "inline-radio", options: ["info", "success", "warning", "danger", "neutral", "accent"] },
    icon: { control: "select", options: [undefined, ...Object.keys(icons)] },
    modelValue: { control: false },
  },
  render: args => ({
    components: { AkMessage },
    setup: () => ({ args }),
    template: '<AkMessage v-bind="args">数据来自游戏版本 2.7.61。</AkMessage>',
  }),
} satisfies Meta<typeof AkMessage>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};
export const Variants: Story = { name: "变体", ...demo(VariantsDemo) };
export const Closable: Story = { name: "可关闭", ...demo(ClosableDemo) };
export const Banner: Story = { name: "横幅", ...demo(BannerDemo) };
