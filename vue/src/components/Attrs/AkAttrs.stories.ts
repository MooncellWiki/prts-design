import type { Meta, StoryObj } from "@storybook/vue3-vite";

import { demo } from "../../demo/story";
import AkAttr from "./AkAttr.vue";
import AkAttrs from "./AkAttrs.vue";
import CompactDemo from "./demos/Compact.vue";
import PanelDemo from "./demos/Panel.vue";

const meta = {
  title: "Arknights/Attrs",
  component: AkAttrs,
  subcomponents: { AkAttr },
  tags: ["autodocs"],
  args: { compact: false },
  render: args => ({
    components: { AkAttrs, AkAttr },
    setup: () => ({ args }),
    template: `<AkAttrs v-bind="args">
  <AkAttr name="HP" zh="生命上限" :value="2880" accent />
  <AkAttr name="ATK" zh="攻击" :value="610" accent />
  <AkAttr name="COST" zh="部署费用" :value="23" />
  <AkAttr name="INTERVAL" zh="攻击间隔" :value="1.3" unit="s" />
</AkAttrs>`,
  }),
} satisfies Meta<typeof AkAttrs>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};
export const Panel: Story = { name: "属性面板", ...demo(PanelDemo) };
export const Compact: Story = { name: "紧凑", ...demo(CompactDemo) };
