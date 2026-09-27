import type { Meta, StoryObj } from "@storybook/vue3-vite";

import { demo } from "../../demo/story";
import AkSp from "./AkSp.vue";
import AkSpTrigger from "./AkSpTrigger.vue";
import AkSpValue from "./AkSpValue.vue";
import TypesDemo from "./demos/Types.vue";
import ValuesDemo from "./demos/Values.vue";

const meta = {
  title: "Arknights/Sp",
  component: AkSp,
  subcomponents: { AkSpTrigger, AkSpValue },
  tags: ["autodocs"],
  args: { spType: "attack" },
  argTypes: {
    spType: { control: "inline-radio", options: ["auto", "attack", "hit", "passive"] },
    tip: { control: "text" },
  },
  render: args => ({ components: { AkSp }, setup: () => ({ args }), template: '<AkSp v-bind="args" />' }),
} satisfies Meta<typeof AkSp>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};
export const Types: Story = { name: "SP 类型 / 触发", ...demo(TypesDemo) };
export const Values: Story = { name: "数值芯片", ...demo(ValuesDemo) };
