import type { Meta, StoryObj } from "@storybook/vue3-vite";

import { asset } from "../../demo/asset";
import { demo } from "../../demo/story";
import AkOpCard from "./AkOpCard.vue";
import AkOpGrid from "./AkOpGrid.vue";
import GridDemo from "./demos/Grid.vue";
import SizesDemo from "./demos/Sizes.vue";
import VariantsDemo from "./demos/Variants.vue";

const meta = {
  title: "Arknights/Op Card",
  component: AkOpCard,
  subcomponents: { AkOpGrid },
  tags: ["autodocs"],
  args: {
    name: "陈",
    sub: "Ch'en · LM04",
    avatar: asset("avatar/char_010_chen_2.png"),
    rarity: 6,
    rarityIcon: asset("rarity/rarity_yellow_5.png"),
    profession: "近卫",
    professionIcon: asset("profession/warrior.png"),
    elite: 2,
    eliteIcon: asset("elite/elite_2.png"),
    size: "md",
    variant: "default",
    href: "#",
  },
  argTypes: {
    rarity: { control: "inline-radio", options: [1, 2, 3, 4, 5, 6] },
    elite: { control: "inline-radio", options: [0, 1, 2] },
    size: { control: "inline-radio", options: ["sm", "md", "lg"] },
    variant: { control: "inline-radio", options: ["default", "rail"] },
  },
  render: args => ({ components: { AkOpCard }, setup: () => ({ args }), template: '<AkOpCard v-bind="args" />' }),
} satisfies Meta<typeof AkOpCard>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};
export const Grid: Story = { name: "网格", ...demo(GridDemo) };
export const Sizes: Story = { name: "尺寸", ...demo(SizesDemo) };
export const Variants: Story = { name: "色条 / CSS 星形 / 当前项 / 角标", ...demo(VariantsDemo) };
