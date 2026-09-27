import type { Meta, StoryObj } from "@storybook/vue3-vite";

import { demo } from "../../demo/story";
import { icons } from "../../icons";
import AkButton from "./AkButton.vue";
import AkButtonGroup from "./AkButtonGroup.vue";
import GroupDemo from "./demos/Group.vue";
import IconsDemo from "./demos/Icons.vue";
import SizesDemo from "./demos/Sizes.vue";
import StatesDemo from "./demos/States.vue";
import VariantsDemo from "./demos/Variants.vue";

const meta = {
  title: "Components/Button",
  component: AkButton,
  subcomponents: { AkButtonGroup },
  tags: ["autodocs"],
  args: { variant: "primary", size: "md" },
  argTypes: {
    variant: { control: "select", options: ["default", "primary", "contrast", "outline", "ghost", "danger", "link"] },
    size: { control: "inline-radio", options: ["xs", "sm", "md", "lg", "xl"] },
    icon: { control: "select", options: [undefined, ...Object.keys(icons)] },
    iconPlacement: { control: "inline-radio", options: ["left", "right"] },
    type: { control: false },
  },
  render: args => ({ components: { AkButton }, setup: () => ({ args }), template: '<AkButton v-bind="args">开始行动</AkButton>' }),
} satisfies Meta<typeof AkButton>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};
export const Variants: Story = { name: "变体", ...demo(VariantsDemo) };
export const Sizes: Story = { name: "尺寸", ...demo(SizesDemo) };
export const Icons: Story = { name: "图标 / 图标按钮", ...demo(IconsDemo) };
export const States: Story = { name: "状态", ...demo(StatesDemo) };
export const Group: Story = { name: "按钮组", ...demo(GroupDemo) };
