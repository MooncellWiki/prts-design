import type { Meta, StoryObj } from "@storybook/vue3-vite";

import { demo } from "../../demo/story";
import AkCollapse from "./AkCollapse.vue";
import AkCollapseItem from "./AkCollapseItem.vue";
import AccordionDemo from "./demos/Accordion.vue";
import BasicDemo from "./demos/Basic.vue";

const meta = {
  title: "Components/Accordion",
  component: AkCollapse,
  subcomponents: { AkCollapseItem },
  tags: ["autodocs"],
  args: { accordion: false, modelValue: ["akds"] },
  render: args => ({
    components: { AkCollapse, AkCollapseItem },
    setup: () => ({ args }),
    template: `<AkCollapse v-bind="args" v-model="args.modelValue">
  <AkCollapseItem name="akds" title="什么是 AKDS？"><p>明日方舟网页设计系统，为 prts.wiki 皮肤设计。</p></AkCollapseItem>
  <AkCollapseItem name="codex" title="为什么不用 Codex 默认外观？"><p>视觉语言完全按明日方舟本体重建，而不是套一层配色。</p></AkCollapseItem>
  <AkCollapseItem name="tokens" title="令牌从哪来？"><p>tokens/src 的 DTCG JSON 源，经 Style Dictionary 生成 src/tokens.css。</p></AkCollapseItem>
</AkCollapse>`,
  }),
} satisfies Meta<typeof AkCollapse>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};
export const Basic: Story = { name: "基本", ...demo(BasicDemo) };
export const Accordion: Story = { name: "手风琴（单开）", ...demo(AccordionDemo) };
