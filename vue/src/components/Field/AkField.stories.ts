import type { Meta, StoryObj } from "@storybook/vue3-vite";

import { demo } from "../../demo/story";
import AkInput from "../Input/AkInput.vue";
import AkField from "./AkField.vue";
import BasicDemo from "./demos/Basic.vue";
import ControlsDemo from "./demos/Controls.vue";
import ValidationDemo from "./demos/Validation.vue";

const meta = {
  title: "Components/Field",
  component: AkField,
  tags: ["autodocs"],
  args: { label: "干员名称", required: true, feedback: "支持中文名 / 代号 / 拼音" },
  argTypes: {
    validationStatus: { control: "inline-radio", options: [undefined, "error", "success"] },
  },
  render: args => ({
    components: { AkField, AkInput },
    setup: () => ({ args }),
    template: '<AkField v-bind="args"><AkInput placeholder="例如：陈" /></AkField>',
  }),
} satisfies Meta<typeof AkField>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};
export const Basic: Story = { name: "标签 / 必填 / 说明", ...demo(BasicDemo) };
export const Validation: Story = { name: "校验状态", ...demo(ValidationDemo) };
export const Controls: Story = { name: "各种控件", ...demo(ControlsDemo) };
