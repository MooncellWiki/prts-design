import type { Meta, StoryObj } from "@storybook/vue3-vite";

import { icons } from "../../icons";
import AkIcon from "./AkIcon.vue";

const meta = {
  title: "Components/Icon",
  component: AkIcon,
  tags: ["autodocs"],
  args: { name: "search", size: 24 },
  argTypes: { name: { control: "select", options: Object.keys(icons) } },
} satisfies Meta<typeof AkIcon>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};
export const All: Story = {
  name: "全部图标",
  parameters: { controls: { disable: true } },
  render: () => ({
    components: { AkIcon },
    setup: () => ({ names: Object.keys(icons) }),
    template: `<div class="ak-grid ak-gap-3" style="grid-template-columns: repeat(auto-fill, minmax(96px, 1fr))">
      <div v-for="n in names" :key="n" class="ak-flex-col ak-items-center ak-gap-2 ak-p-3 ak-border">
        <AkIcon :name="n" :size="24" /><code class="ak-fs-xs">{{ n }}</code>
      </div></div>`,
  }),
};
