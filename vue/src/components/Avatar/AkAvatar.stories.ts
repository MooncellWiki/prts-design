import type { Meta, StoryObj } from "@storybook/vue3-vite";

import { asset } from "../../demo/asset";
import { demo } from "../../demo/story";
import AkAvatar from "./AkAvatar.vue";
import AkAvatarGroup from "./AkAvatarGroup.vue";
import GroupDemo from "./demos/Group.vue";
import SizesDemo from "./demos/Sizes.vue";

const meta = {
  title: "Components/Avatar",
  component: AkAvatar,
  subcomponents: { AkAvatarGroup },
  tags: ["autodocs"],
  args: { src: asset("avatar/char_010_chen_2.png"), alt: "陈", size: "md" },
  argTypes: {
    size: { control: "inline-radio", options: ["xs", "sm", "md", "lg", "xl"] },
  },
  render: args => ({ components: { AkAvatar }, setup: () => ({ args }), template: '<AkAvatar v-bind="args">DR</AkAvatar>' }),
} satisfies Meta<typeof AkAvatar>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};
export const Sizes: Story = { name: "尺寸 / 圆形 / 状态点 / 文字", ...demo(SizesDemo) };
export const Group: Story = { name: "头像组", ...demo(GroupDemo) };
