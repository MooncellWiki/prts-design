import type { Meta, StoryObj } from "@storybook/vue3-vite";

import { demo } from "../../demo/story";
import AkPagination from "./AkPagination.vue";
import BasicDemo from "./demos/Basic.vue";
import LinksDemo from "./demos/Links.vue";
import OptionsDemo from "./demos/Options.vue";

const meta = {
  title: "Components/Pagination",
  component: AkPagination,
  tags: ["autodocs"],
  args: { modelValue: 1, pageCount: 24, pageSlot: 7, disabled: false, label: "分页" },
  argTypes: {
    pageSlot: { control: { type: "number", min: 5, max: 13, step: 1 } },
    pageHref: { control: false },
  },
  render: args => ({ components: { AkPagination }, setup: () => ({ args }), template: '<AkPagination v-bind="args" v-model="args.modelValue" />' }),
} satisfies Meta<typeof AkPagination>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};
export const Basic: Story = { name: "基本", ...demo(BasicDemo) };
export const Options: Story = { name: "条数 / 页码格数 / 禁用", ...demo(OptionsDemo) };
export const Links: Story = { name: "链接形态", ...demo(LinksDemo) };
