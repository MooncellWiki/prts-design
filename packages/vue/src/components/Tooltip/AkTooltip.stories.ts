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

/** 贴着视口边缘：上 / 下、左 / 右放不下的换到对边，伸出左 / 右缘的平移回视口（e2e/tooltip.spec.ts 在手机宽度下核对）。整块撑满视口高，不进文档页 */
export const Edges: Story = {
  name: "贴边自动避让",
  tags: ["!autodocs"],
  render: () => ({
    components: { AkTooltip, AkPopover, AkButton },
    template: `<div style="position: relative; height: calc(100vh - 32px)">
  <div class="ak-flex ak-justify-between">
    <AkTooltip trigger="manual" :model-value="true">
      <template #trigger><AkButton id="edge-tl" size="sm">左上</AkButton></template>
      上方放不下换到下方，伸出左缘的平移回来
    </AkTooltip>
    <AkTooltip placement="right" trigger="manual" :model-value="true">
      <template #trigger><AkButton id="edge-tr" size="sm">右上</AkButton></template>
      右边放不下换到左边
    </AkTooltip>
  </div>
  <div class="ak-flex ak-justify-center" style="margin-top: 120px">
    <AkTooltip trigger="manual" :model-value="true">
      <template #trigger><AkButton id="edge-mid" size="sm">正中</AkButton></template>
      放得下就照旧
    </AkTooltip>
  </div>
  <div style="position: absolute; left: 0; bottom: 0">
    <AkTooltip>
      <template #trigger><AkButton id="edge-bl" size="sm">左下（悬停）</AkButton></template>
      悬停时才量：伸出左缘的平移回来
    </AkTooltip>
  </div>
  <div style="position: absolute; right: 0; bottom: 0">
    <AkPopover title="右下" trigger="manual" :model-value="true">
      <template #trigger><AkButton id="edge-br" size="sm">右下</AkButton></template>
      下方放不下换到上方，伸出右缘的平移回来
    </AkPopover>
  </div>
</div>`,
  }),
};
