import type { Meta, StoryObj } from "@storybook/vue3-vite";

import { demo } from "../../demo/story";
import AkDialogue from "./AkDialogue.vue";
import AkDialogueLine from "./AkDialogueLine.vue";
import BasicDemo from "./demos/Basic.vue";
import SegmentsDemo from "./demos/Segments.vue";

const meta = {
  title: "Arknights/Dialogue",
  component: AkDialogueLine,
  subcomponents: { AkDialogue },
  tags: ["autodocs"],
  args: { speaker: "陈" },
  render: args => ({
    components: { AkDialogue, AkDialogueLine },
    setup: () => ({ args }),
    template: `<AkDialogue>
  <AkDialogueLine v-bind="args">博士，现在起由我担任你的护卫。</AkDialogueLine>
  <AkDialogueLine>陈将剑鞘靠在墙边，环视了一圈办公室。</AkDialogueLine>
</AkDialogue>`,
  }),
} satisfies Meta<typeof AkDialogueLine>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};
export const Basic: Story = { name: "对话与旁白", ...demo(BasicDemo) };
export const Segments: Story = { name: "分段 + 剧透", ...demo(SegmentsDemo) };
