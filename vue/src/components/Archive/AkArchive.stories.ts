import type { Meta, StoryObj } from "@storybook/vue3-vite";

import { demo } from "../../demo/story";
import AkArchive from "./AkArchive.vue";
import AkArchivePlay from "./AkArchivePlay.vue";
import IntelDemo from "./demos/Intel.vue";
import RecordDemo from "./demos/Record.vue";

const meta = {
  title: "Arknights/Archive",
  component: AkArchive,
  subcomponents: { AkArchivePlay },
  tags: ["autodocs"],
  args: { title: "情报资料一", kicker: "Intel · 未获得时档案", unlock: "通关主题曲 2-2", unlockLabel: "解锁条件" },
  render: args => ({
    components: { AkArchive, AkArchivePlay },
    setup: () => ({ args }),
    template: `<AkArchive v-bind="args">
  <p><b>【陈】</b>
龙门近卫局警司，特别督察组组长。
负责龙门近卫局特别督察组的日常指挥执行工作。</p>
  <template #footer><AkArchivePlay href="#">阅读密录 · 一鼓作气</AkArchivePlay></template>
</AkArchive>`,
  }),
} satisfies Meta<typeof AkArchive>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};
export const Intel: Story = { name: "未获得时档案", ...demo(IntelDemo) };
export const Record: Story = { name: "干员密录 / 悖论模拟", ...demo(RecordDemo) };
