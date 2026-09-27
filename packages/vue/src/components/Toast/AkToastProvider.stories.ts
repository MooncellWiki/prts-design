import type { Meta, StoryObj } from "@storybook/vue3-vite";
import { onMounted, useTemplateRef } from "vue";

import { demo } from "../../demo/story";
import AkButton from "../Button/AkButton.vue";
import AkToastProvider from "./AkToastProvider.vue";
import OptionsDemo from "./demos/Options.vue";
import VariantsDemo from "./demos/Variants.vue";

const meta = {
  title: "Components/Toast",
  component: AkToastProvider,
  tags: ["autodocs"],
  args: { duration: 5000, closable: true, keepAliveOnHover: true, max: 5, label: "通知" },
  argTypes: { to: { control: false } },
  render: args => ({
    components: { AkToastProvider, AkButton },
    setup() {
      const toaster = useTemplateRef<InstanceType<typeof AkToastProvider>>("toaster");
      // 进来先弹一条，看得到外观
      onMounted(() => toaster.value?.success("页面已加入监视列表", { title: "完成" }));
      return { args };
    },
    template: `<AkToastProvider ref="toaster" v-bind="args">
  <div class="ak-flex ak-wrap ak-gap-3">
    <AkButton @click="$refs.toaster.info('本页数据取自游戏版本 2.7.61')">信息</AkButton>
    <AkButton @click="$refs.toaster.success('页面已加入监视列表', { title: '完成' })">成功</AkButton>
    <AkButton @click="$refs.toaster.warning('本页含未实装内容')">警告</AkButton>
    <AkButton @click="$refs.toaster.error('保存失败：会话过期')">失败</AkButton>
  </div>
</AkToastProvider>`,
  }),
} satisfies Meta<typeof AkToastProvider>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};
export const Variants: Story = { name: "四种提示 · useToast()", ...demo(VariantsDemo) };
export const Options: Story = { name: "时长 · 关闭 · 富文本 · 上限", ...demo(OptionsDemo) };
