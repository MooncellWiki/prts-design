import type { Meta, StoryObj } from "@storybook/vue3-vite";

import { demo } from "../../demo/story";
import AkRadio from "./AkRadio.vue";
import AkRadioButton from "./AkRadioButton.vue";
import AkRadioGroup from "./AkRadioGroup.vue";
import BasicDemo from "./demos/Basic.vue";
import ButtonsDemo from "./demos/Buttons.vue";

const meta = {
  title: "Components/Radio",
  component: AkRadioGroup,
  subcomponents: { AkRadio, AkRadioButton },
  tags: ["autodocs"],
  args: { modelValue: "melee", size: "md", vertical: false, disabled: false, label: "部署位置" },
  argTypes: {
    size: { control: "inline-radio", options: ["sm", "md", "lg"] },
  },
  render: args => ({
    components: { AkRadioGroup, AkRadio, AkRadioButton },
    setup: () => ({ args }),
    template: `<div class="ak-flex-col ak-gap-4 ak-items-start">
  <AkRadioGroup v-bind="args">
    <AkRadio value="any">不限</AkRadio>
    <AkRadio value="melee">近战位</AkRadio>
    <AkRadio value="ranged">远程位</AkRadio>
  </AkRadioGroup>
  <AkRadioGroup v-bind="args">
    <AkRadioButton value="any">不限</AkRadioButton>
    <AkRadioButton value="melee">近战位</AkRadioButton>
    <AkRadioButton value="ranged">远程位</AkRadioButton>
  </AkRadioGroup>
</div>`,
  }),
} satisfies Meta<typeof AkRadioGroup>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};
export const Basic: Story = { name: "单选组", ...demo(BasicDemo) };
export const Buttons: Story = { name: "单选按钮组（分段控件）", ...demo(ButtonsDemo) };
