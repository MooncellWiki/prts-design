import type { Meta, StoryObj } from "@storybook/vue3-vite";

import { asset } from "../../demo/asset";
import { demo } from "../../demo/story";
import AkModule from "./AkModule.vue";
import AkModuleStage from "./AkModuleStage.vue";
import AkModuleUnlock from "./AkModuleUnlock.vue";
import CollapseDemo from "./demos/Collapse.vue";
import FullDemo from "./demos/Full.vue";
import OriginalDemo from "./demos/Original.vue";

const meta = {
  title: "Arknights/Module",
  component: AkModule,
  subcomponents: { AkModuleStage, AkModuleUnlock },
  tags: ["autodocs"],
  args: {
    name: "罗德岛制式剑",
    src: asset("module/uniequip_002_chen.png"),
    typeName: "SWO-X",
    typeIcon: asset("module/type_swo-x.png"),
    color: "red",
    hint: "调整效果含特性调整与天赋调整，所有效果调整先于潜能提升生效。",
    collapsible: true,
    modelValue: false,
  },
  argTypes: {
    color: { control: "select", options: [undefined, "red", "blue", "green", "yellow", "purple"] },
  },
  render: args => ({
    components: { AkModule, AkModuleStage },
    setup: () => ({ args }),
    template: `<AkModule v-bind="args">
  <p>七月七，晴。生辰，她激动地想要为魏彦吾展示拔刀，却找不到魏彦吾的踪影。等了三天，没有等到。<br>五月十三，多云。以泪锋斩断了庭中的三十年老树，砸坏了屋顶。魏彦吾没有出现，只是差人植了一棵新的。她不再期待魏彦吾的认可。<br>一月一，大雨。贺年，倾盆大雨，去贫民区的途中路见不平，愤而出手，以一敌十五。</p>
  <template #stages>
    <AkModuleStage :stage="1" :stats="{ 攻击: '+50', 攻击速度: '+5' }" kicker="特性追加">技能期间造成的伤害提升<span class="ak-rt-vup">10%</span></AkModuleStage>
  </template>
</AkModule>`,
  }),
} satisfies Meta<typeof AkModule>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};
export const Full: Story = { name: "完整卡片", ...demo(FullDemo) };
export const Collapse: Story = { name: "故事折叠（v-model）", ...demo(CollapseDemo) };
export const Original: Story = { name: "原型证章", ...demo(OriginalDemo) };
