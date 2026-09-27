import type { Meta, StoryObj } from "@storybook/vue3-vite";

import { demo } from "../../demo/story";
import AkRichText from "./AkRichText.vue";
import TagsDemo from "./demos/Tags.vue";
import VariablesDemo from "./demos/Variables.vue";
import WrapDemo from "./demos/Wrap.vue";

const meta = {
  title: "Arknights/RichText",
  component: AkRichText,
  tags: ["autodocs"],
  args: {
    text: "对前方范围内最多<@ba.vup>{max_target}</>名敌人造成相当于攻击力<@ba.vup>{atk_scale:0%}</>的<@ba.rem>物理</>和相当于攻击力<@ba.vup>{atk_scale:0%}</>的<@ba.rem>法术</>伤害",
    vars: { max_target: 6, atk_scale: 4.1 },
    terms: { "ba.stun": "晕眩：无法移动、阻挡、攻击及使用技能" },
  },
  argTypes: {
    variant: {
      control: "select",
      options: [undefined, "vup", "vdown", "rem", "kw", "talpu", "term", "imp", "enemy", "gild", "drop", "acrem", "level", "pn"],
    },
    tag: { control: false },
  },
  render: args => ({ components: { AkRichText }, setup: () => ({ args }), template: '<AkRichText v-bind="args">+50%</AkRichText>' }),
} satisfies Meta<typeof AkRichText>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};
export const Tags: Story = { name: "游戏标记", ...demo(TagsDemo) };
export const Variables: Story = { name: "占位符 + blackboard", ...demo(VariablesDemo) };
export const Wrap: Story = { name: "只包一层", ...demo(WrapDemo) };
