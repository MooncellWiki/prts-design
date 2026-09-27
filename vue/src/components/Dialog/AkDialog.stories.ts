import type { Meta, StoryObj } from "@storybook/vue3-vite";
import { ref, watch } from "vue";

import { demo } from "../../demo/story";
import AkButton from "../Button/AkButton.vue";
import AkDialog from "./AkDialog.vue";
import BasicDemo from "./demos/Basic.vue";
import OptionsDemo from "./demos/Options.vue";

const meta = {
  title: "Components/Dialog",
  component: AkDialog,
  tags: ["autodocs"],
  args: {
    title: "确认精英化",
    size: "md",
    closable: true,
    maskClosable: true,
    closeOnEsc: true,
    positiveText: "确认",
    negativeText: "取消",
    modelValue: false,
  },
  argTypes: {
    size: { control: "inline-radio", options: ["sm", "md", "lg", "full"] },
  },
  render: args => ({
    components: { AkDialog, AkButton },
    setup() {
      // 控件里的 modelValue 与按钮都能开；关掉只改本地状态
      const open = ref(args.modelValue);
      watch(
        () => args.modelValue,
        v => (open.value = v),
      );
      return { args, open };
    },
    template: `<AkButton variant="primary" @click="open = true">打开对话框</AkButton>
<AkDialog v-bind="args" v-model="open">将「陈」精英化至 <b>精英二</b>。</AkDialog>`,
  }),
} satisfies Meta<typeof AkDialog>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};
export const Basic: Story = { name: "确认对话框", ...demo(BasicDemo) };
export const Options: Story = { name: "尺寸 · 自定义底栏 · 不可随手关", ...demo(OptionsDemo) };
