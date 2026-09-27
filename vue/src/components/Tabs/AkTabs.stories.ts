import type { Meta, StoryObj } from "@storybook/vue3-vite";

import { demo } from "../../demo/story";
import AkTab from "./AkTab.vue";
import AkTabPane from "./AkTabPane.vue";
import AkTabs from "./AkTabs.vue";
import VariantsDemo from "./demos/Variants.vue";
import VerticalDemo from "./demos/Vertical.vue";

const meta = {
  title: "Components/Tabs",
  component: AkTabs,
  subcomponents: { AkTabPane, AkTab },
  tags: ["autodocs"],
  args: { variant: "underline", placement: "top", label: "干员资料" },
  argTypes: {
    variant: { control: "inline-radio", options: ["underline", "pill", "block"] },
    placement: { control: "inline-radio", options: ["top", "left"] },
  },
  render: args => ({
    components: { AkTabs, AkTabPane },
    setup: () => ({ args }),
    template: `<AkTabs v-bind="args">
  <AkTabPane name="op" tab="干员">干员面板</AkTabPane>
  <AkTabPane name="skill" tab="技能">技能面板</AkTabPane>
  <AkTabPane name="module" tab="模组">模组面板</AkTabPane>
</AkTabs>`,
  }),
} satisfies Meta<typeof AkTabs>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};
export const Variants: Story = { name: "变体", ...demo(VariantsDemo) };
export const Vertical: Story = { name: "竖排（干员档案）", ...demo(VerticalDemo) };
