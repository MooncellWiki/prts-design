import type { Meta, StoryObj } from "@storybook/vue3-vite";

import { demo } from "../../demo/story";
import { icons } from "../../icons";
import AkBackTop from "./AkBackTop.vue";
import BasicDemo from "./demos/Basic.vue";
import ScrollDemo from "./demos/Scroll.vue";

/** 整页 fixed 那枚在 < 1400 的视口里被皮肤收起，Playground 用 absolute 放在一个框里看外观 */
const meta = {
  title: "Components/FAB",
  component: AkBackTop,
  tags: ["autodocs"],
  args: { modelValue: true, label: "回到顶部", icon: "up", position: "absolute", visibilityHeight: false },
  argTypes: {
    icon: { control: "select", options: Object.keys(icons) },
    position: { control: "inline-radio", options: ["fixed", "absolute"] },
    listenTo: { control: false },
  },
  render: args => ({
    components: { AkBackTop },
    setup: () => ({ args }),
    template: `<div class="ak-relative ak-border ak-bg-surface ak-p-4">
  <p>右下角是 AkBackTop（position="absolute"）。</p>
  <p class="ak-mb-0">fixed 时贴视口右下；视口窄于 1400px 时被皮肤收起。</p>
  <AkBackTop v-bind="args" v-model="args.modelValue" />
</div>`,
  }),
} satisfies Meta<typeof AkBackTop>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};
export const Basic: Story = { name: "外观 / v-model 控制显隐", ...demo(BasicDemo) };
export const Scroll: Story = { name: "滚动区域里的回到顶部", ...demo(ScrollDemo) };
