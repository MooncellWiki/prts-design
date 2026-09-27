import type { Meta, StoryObj } from "@storybook/vue3-vite";

import { asset } from "../../demo/asset";
import { demo } from "../../demo/story";
import AkCard from "./AkCard.vue";
import AkCardGrid from "./AkCardGrid.vue";
import CoverDemo from "./demos/Cover.vue";
import GridDemo from "./demos/Grid.vue";
import HeaderDemo from "./demos/Header.vue";
import VariantsDemo from "./demos/Variants.vue";

const meta = {
  title: "Components/Card",
  component: AkCard,
  subcomponents: { AkCardGrid },
  tags: ["autodocs"],
  args: { eyebrow: "Chapter 08", title: "怒号光明", cover: asset("ui/default_breaking_news.png"), variant: "default", hoverable: true },
  argTypes: {
    variant: { control: "inline-radio", options: ["default", "flat", "inset"] },
    accent: { control: "inline-radio", options: [undefined, "top", "left"] },
    titleTag: { control: "inline-radio", options: ["div", "h2", "h3", "h4", "h5", "h6"] },
  },
  render: args => ({
    components: { AkCard },
    setup: () => ({ args }),
    template: '<AkCard v-bind="args"><p class="ak-fs-sm ak-fg-2 ak-mb-0">主线第八章。整合运动与龙门的决战。</p></AkCard>',
  }),
} satisfies Meta<typeof AkCard>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};
export const Cover: Story = { name: "封面 / 眉题 / 页脚", ...demo(CoverDemo) };
export const Header: Story = { name: "标题栏 / 选中", ...demo(HeaderDemo) };
export const Variants: Story = { name: "外观 / 色条", ...demo(VariantsDemo) };
export const Grid: Story = { name: "卡片网格（整卡链接）", ...demo(GridDemo) };
