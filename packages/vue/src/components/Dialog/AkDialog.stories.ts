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

/** 叠开（列表里再开预览）+ 页面比视口长：开着时页面滚不动、正文照常内滚，关掉上面那层仍锁着，全关后恢复（e2e/dialog.spec.ts） */
export const Stacked: Story = {
  name: "叠开 · 滚动锁",
  tags: ["!autodocs"],
  render: () => ({
    components: { AkDialog, AkButton },
    setup: () => ({ list: ref(false), preview: ref(false), items: Array.from({ length: 40 }, (_, i) => `资源 ${i + 1}`) }),
    template: `<div style="height: 300vh; padding-top: 100vh">
  <AkButton id="open-list" @click="list = true">导出</AkButton>
  <AkDialog v-model="list" title="资源列表">
    <AkButton id="open-preview" size="sm" @click="preview = true">预览</AkButton>
    <p v-for="it in items" :key="it">{{ it }}</p>
  </AkDialog>
  <AkDialog v-model="preview" size="sm" title="预览">图片预览</AkDialog>
</div>`,
  }),
};
