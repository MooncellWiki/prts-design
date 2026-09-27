import type { Meta, StoryObj } from "@storybook/vue3-vite";

import { demo } from "../../demo/story";
import AkNews from "./AkNews.vue";
import BasicDemo from "./demos/Basic.vue";

const meta = {
  title: "Arknights/News",
  component: AkNews,
  tags: ["autodocs"],
  args: { title: "Breaking News" },
  render: args => ({
    components: { AkNews },
    setup: () => ({ args }),
    template: '<AkNews v-bind="args">「怒号光明」复刻开启 · 新干员「维什戴尔」限时寻访 · <a href="#">查看活动一览</a></AkNews>',
  }),
} satisfies Meta<typeof AkNews>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};
export const Basic: Story = { name: "横幅", ...demo(BasicDemo) };
