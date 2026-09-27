import type { Meta, StoryObj } from "@storybook/vue3-vite";

import { demo } from "../../demo/story";
import AkButton from "../Button/AkButton.vue";
import AkPopover from "./AkPopover.vue";
import AkTooltip from "./AkTooltip.vue";
import BasicDemo from "./demos/Basic.vue";
import PlacementsDemo from "./demos/Placements.vue";
import PopoverDemo from "./demos/Popover.vue";

const meta = {
  title: "Components/Tooltip",
  component: AkTooltip,
  subcomponents: { AkPopover },
  tags: ["autodocs"],
  args: { placement: "top", trigger: "hover", delay: 100, duration: 100, disabled: false, modelValue: true },
  argTypes: {
    placement: { control: "select", options: ["top", "top-start", "top-end", "bottom", "bottom-start", "bottom-end", "left", "right"] },
    trigger: { control: "inline-radio", options: ["hover", "focus", "click", "manual"] },
  },
  render: args => ({
    components: { AkTooltip, AkButton },
    setup: () => ({ args }),
    template: `<div class="ak-p-6 ak-flex ak-justify-center">
  <AkTooltip v-bind="args">
    <template #trigger><AkButton variant="outline">攻击回复</AkButton></template>
    每次攻击回复1点技力
  </AkTooltip>
</div>`,
  }),
} satisfies Meta<typeof AkTooltip>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};
export const Basic: Story = { name: "基本用法 / 术语", ...demo(BasicDemo) };
export const Placements: Story = { name: "方向", ...demo(PlacementsDemo) };
export const Popover: Story = { name: "弹出卡片 Popover", ...demo(PopoverDemo) };
