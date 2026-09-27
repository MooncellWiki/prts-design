import type { Meta, StoryObj } from "@storybook/vue3-vite";

import { demo } from "../../demo/story";
import AkTrust from "./AkTrust.vue";
import ValuesDemo from "./demos/Values.vue";

const meta = {
  title: "Arknights/Trust",
  component: AkTrust,
  tags: ["autodocs"],
  args: { value: 200 },
  argTypes: {
    value: { control: { type: "range", min: 0, max: 200, step: 10 } },
  },
  render: args => ({ components: { AkTrust }, setup: () => ({ args }), template: '<AkTrust v-bind="args" />' }),
} satisfies Meta<typeof AkTrust>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};
export const Values: Story = { name: "信赖值", ...demo(ValuesDemo) };
