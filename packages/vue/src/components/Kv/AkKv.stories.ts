import type { Meta, StoryObj } from "@storybook/vue3-vite";

import { demo } from "../../demo/story";
import AkKv from "./AkKv.vue";
import AkKvItem from "./AkKvItem.vue";
import BoxedDemo from "./demos/Boxed.vue";
import InlineDemo from "./demos/Inline.vue";
import PlainDemo from "./demos/Plain.vue";

const meta = {
  title: "Arknights/Kv",
  component: AkKv,
  subcomponents: { AkKvItem },
  tags: ["autodocs"],
  args: { bordered: true, inline: false },
  render: args => ({
    components: { AkKv, AkKvItem },
    setup: () => ({ args }),
    template: `<AkKv v-bind="args">
  <AkKvItem term="代号">陈</AkKvItem>
  <AkKvItem term="编号"><span class="ak-code-id">LM04</span></AkKvItem>
  <AkKvItem term="画师"><a href="#">唯@W</a></AkKvItem>
  <AkKvItem term="上线">2019.05.01</AkKvItem>
</AkKv>`,
  }),
} satisfies Meta<typeof AkKv>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};
export const Boxed: Story = { name: "带框（信息栏）", ...demo(BoxedDemo) };
export const Plain: Story = { name: "不带框（档案）", ...demo(PlainDemo) };
export const Inline: Story = { name: "内联", ...demo(InlineDemo) };
