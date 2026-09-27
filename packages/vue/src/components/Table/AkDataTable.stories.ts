import type { Meta, StoryObj } from "@storybook/vue3-vite";
import type { ConcreteComponent } from "vue";

import { demo } from "../../demo/story";
import AkDataTable from "./AkDataTable.vue";
import BasicDemo from "./demos/Basic.vue";
import CompactDemo from "./demos/Compact.vue";
import SortDemo from "./demos/Sort.vue";

const meta = {
  title: "Components/Table",
  component: AkDataTable as unknown as ConcreteComponent,
  tags: ["autodocs"],
  args: {
    striped: false,
    compact: false,
    label: "陈 · 各阶段满级属性",
    columns: [
      { key: "phase", title: "阶段" },
      { key: "maxLevel", title: "等级上限" },
      { key: "hp", title: "生命", num: true, sorter: true },
      { key: "atk", title: "攻击", num: true, sorter: true },
      { key: "def", title: "防御", num: true, sorter: true },
    ],
    data: [
      { phase: "精英零", maxLevel: 50, hp: 1684, atk: 361, def: 221 },
      { phase: "精英一", maxLevel: 80, hp: 2188, atk: 469, def: 288 },
      { phase: "精英二", maxLevel: 90, hp: 2880, atk: 610, def: 352 },
    ],
  },
  argTypes: {
    striped: { control: "boolean" },
    compact: { control: "boolean" },
    label: { control: "text" },
  },
  render: args => ({ components: { AkDataTable }, setup: () => ({ args }), template: '<AkDataTable v-bind="args" />' }),
} satisfies Meta<typeof AkDataTable>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};
export const Basic: Story = { name: "基本（斑马纹 / 选中行）", ...demo(BasicDemo) };
export const Sort: Story = { name: "排序 / 自定义单元格", ...demo(SortDemo) };
export const Compact: Story = { name: "紧凑 / 空数据", ...demo(CompactDemo) };
