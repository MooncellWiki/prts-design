import type { Meta, StoryObj } from "@storybook/vue3-vite";

import { demo } from "../../demo/story";
import AkPanel from "./AkPanel.vue";
import BasicDemo from "./demos/Basic.vue";
import CollapsibleDemo from "./demos/Collapsible.vue";

const meta = {
  title: "Components/Panel",
  component: AkPanel,
  tags: ["autodocs"],
  args: { title: "今日信息", en: "Today", titleTag: "div", inverse: false, collapsible: false },
  argTypes: {
    titleTag: { control: "inline-radio", options: ["div", "h2", "h3", "h4", "h5", "h6"] },
  },
  render: args => ({
    components: { AkPanel },
    setup: () => ({ args }),
    template: '<AkPanel v-bind="args"><p class="ak-fs-sm ak-m-0">面板：标题栏左侧色条 + 表面 2 底色。</p></AkPanel>',
  }),
} satisfies Meta<typeof AkPanel>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};
export const Basic: Story = { name: "基础 / 标题栏附加", ...demo(BasicDemo) };
export const Collapsible: Story = { name: "反转 / 可折叠", ...demo(CollapsibleDemo) };
