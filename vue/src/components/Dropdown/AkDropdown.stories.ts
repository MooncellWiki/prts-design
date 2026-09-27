import type { Meta, StoryObj } from "@storybook/vue3-vite";

import { demo } from "../../demo/story";
import AkButton from "../Button/AkButton.vue";
import AkDropdown from "./AkDropdown.vue";
import BasicDemo from "./demos/Basic.vue";
import GroupsDemo from "./demos/Groups.vue";

const meta = {
  title: "Components/Dropdown",
  component: AkDropdown,
  tags: ["autodocs"],
  args: {
    options: [
      {
        type: "group",
        label: "页面操作",
        children: [
          { key: "move", label: "移动", icon: "move" },
          { key: "protect", label: "保护", icon: "lock" },
        ],
      },
      { type: "divider" },
      { key: "delete", label: "删除", icon: "trash", danger: true },
    ],
    placement: "bottom-start",
    disabled: false,
    modelValue: true,
  },
  argTypes: {
    placement: { control: "inline-radio", options: ["bottom-start", "bottom-end"] },
    value: { control: "text" },
  },
  render: args => ({
    components: { AkDropdown, AkButton },
    setup: () => ({ args }),
    template: `<div class="ak-flex ak-justify-center ak-items-start" style="min-height: 220px">
  <AkDropdown v-bind="args"><AkButton>下拉菜单 ▾</AkButton></AkDropdown>
</div>`,
  }),
} satisfies Meta<typeof AkDropdown>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};
export const Basic: Story = { name: "基本用法 / 单选菜单", ...demo(BasicDemo) };
export const Groups: Story = { name: "分组 · 链接项（页面动作「更多」）", ...demo(GroupsDemo) };
