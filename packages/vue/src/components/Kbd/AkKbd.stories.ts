import type { Meta, StoryObj } from "@storybook/vue3-vite";

import { demo } from "../../demo/story";
import AkKbd from "./AkKbd.vue";
import BasicDemo from "./demos/Basic.vue";

const meta = {
  title: "Components/Kbd",
  component: AkKbd,
  tags: ["autodocs"],
  render: () => ({ components: { AkKbd }, template: "<AkKbd>Esc</AkKbd>" }),
} satisfies Meta<typeof AkKbd>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};
export const Basic: Story = { name: "快捷键提示", ...demo(BasicDemo) };
