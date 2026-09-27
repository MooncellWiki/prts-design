import type { Meta, StoryObj } from "@storybook/vue3-vite";

import { asset } from "../../demo/asset";
import { demo } from "../../demo/story";
import AkOpRow from "./AkOpRow.vue";
import BasicDemo from "./demos/Basic.vue";
import TableDemo from "./demos/Table.vue";

const meta = {
  title: "Arknights/Op Row",
  component: AkOpRow,
  tags: ["autodocs"],
  args: { name: "煌", avatar: asset("avatar/char_017_huang_2.png"), rarity: 6, meta: "强攻手", stars: true, href: "#" },
  argTypes: {
    rarity: { control: "inline-radio", options: [1, 2, 3, 4, 5, 6] },
  },
  render: args => ({ components: { AkOpRow }, setup: () => ({ args }), template: '<AkOpRow v-bind="args" />' }),
} satisfies Meta<typeof AkOpRow>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};
export const Basic: Story = { name: "条目", ...demo(BasicDemo) };
export const Table: Story = { name: "表格里 / 自定义第二行", ...demo(TableDemo) };
