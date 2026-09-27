import type { Meta, StoryObj } from "@storybook/vue3-vite";

import { asset } from "../../demo/asset";
import { demo } from "../../demo/story";
import AkPot from "./AkPot.vue";
import AkPotList from "./AkPotList.vue";
import BasicDemo from "./demos/Basic.vue";

const meta = {
  title: "Arknights/Pot List",
  component: AkPotList,
  subcomponents: { AkPot },
  tags: ["autodocs"],
  args: { value: 3 },
  argTypes: {
    value: { control: "inline-radio", options: [1, 2, 3, 4, 5, 6] },
  },
  render: args => ({
    components: { AkPotList, AkPot },
    setup: () => ({ args, icon: (n: number) => asset(`potential/potential_${n - 1}.png`) }),
    template: `<AkPotList v-bind="args">
  <AkPot :level="2" :src="icon(2)">部署费用<span class="ak-rt-vup">-1</span></AkPot>
  <AkPot :level="3" :src="icon(3)">再部署时间<span class="ak-rt-vup">-4秒</span></AkPot>
  <AkPot :level="4" :src="icon(4)">攻击力<span class="ak-rt-vup">+23</span></AkPot>
  <AkPot :level="5" :src="icon(5)">第二天赋效果增强</AkPot>
  <AkPot :level="6" :src="icon(6)">部署费用<span class="ak-rt-vup">-1</span></AkPot>
</AkPotList>`,
  }),
} satisfies Meta<typeof AkPotList>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};
export const Basic: Story = { name: "潜能提升（陈）", ...demo(BasicDemo) };
