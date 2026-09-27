import type { Meta, StoryObj } from "@storybook/vue3-vite";

import { demo } from "../../demo/story";
import AkHeading from "./AkHeading.vue";
import ExtraDemo from "./demos/Extra.vue";
import VariantsDemo from "./demos/Variants.vue";

const meta = {
  title: "Components/Heading",
  component: AkHeading,
  tags: ["autodocs"],
  args: { title: "技能", en: "Skills", level: 2, variant: "bar", size: "md", stack: false },
  argTypes: {
    level: { control: "inline-radio", options: [1, 2, 3, 4, 5, 6] },
    variant: { control: "inline-radio", options: ["bar", "underline"] },
    size: { control: "inline-radio", options: ["md", "lg"] },
  },
  render: args => ({ components: { AkHeading }, setup: () => ({ args }), template: '<AkHeading v-bind="args" class="ak-mt-0" />' }),
} satisfies Meta<typeof AkHeading>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};
export const Variants: Story = { name: "变体 / 尺寸", ...demo(VariantsDemo) };
export const Extra: Story = { name: "叠放 / 右侧附加", ...demo(ExtraDemo) };
