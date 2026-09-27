import type { Meta, StoryObj } from "@storybook/vue3-vite";

import { demo } from "../../demo/story";
import AkStep from "./AkStep.vue";
import AkSteps from "./AkSteps.vue";
import BasicDemo from "./demos/Basic.vue";
import ProgressDemo from "./demos/Progress.vue";

const meta = {
  title: "Components/Stepper",
  component: AkSteps,
  subcomponents: { AkStep },
  tags: ["autodocs"],
  args: { current: 3, label: "精英化进度" },
  argTypes: {
    current: { control: { type: "number", min: 0, max: 5, step: 1 } },
  },
  render: args => ({
    components: { AkSteps, AkStep },
    setup: () => ({ args }),
    template: `<AkSteps v-bind="args">
  <AkStep title="精英零" />
  <AkStep title="精英一" />
  <AkStep title="精英二" />
  <AkStep title="满级" />
</AkSteps>`,
  }),
} satisfies Meta<typeof AkSteps>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};
export const Basic: Story = { name: "基本", ...demo(BasicDemo) };
export const Progress: Story = { name: "随 current 推进", ...demo(ProgressDemo) };
