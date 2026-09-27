import type { Meta, StoryObj } from "@storybook/vue3-vite";

import { demo } from "../../demo/story";
import AkTimeline from "./AkTimeline.vue";
import AkTimelineItem from "./AkTimelineItem.vue";
import BasicDemo from "./demos/Basic.vue";
import SlotsDemo from "./demos/Slots.vue";

/** AkTimeline 只是容器，Playground 调的是 AkTimelineItem 的 props */
const meta = {
  title: "Components/Timeline",
  component: AkTimelineItem,
  subcomponents: { AkTimeline },
  tags: ["autodocs"],
  args: { time: "2026.08.01", title: "2.7.61 版本", content: "当前数据版本。", status: "active" },
  argTypes: {
    status: { control: "inline-radio", options: ["wait", "active", "done"] },
  },
  render: args => ({
    components: { AkTimeline, AkTimelineItem },
    setup: () => ({ args }),
    template: `<AkTimeline>
  <AkTimelineItem time="2019.04.30" title="公开测试开启" content="明日方舟正式上线。" status="done" />
  <AkTimelineItem v-bind="args" />
  <AkTimelineItem time="TBA" title="下一版本" />
</AkTimeline>`,
  }),
} satisfies Meta<typeof AkTimelineItem>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};
export const Basic: Story = { name: "基本", ...demo(BasicDemo) };
export const Slots: Story = { name: "标题插槽", ...demo(SlotsDemo) };
