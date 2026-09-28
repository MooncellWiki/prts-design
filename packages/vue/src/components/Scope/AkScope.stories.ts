import type { Meta, StoryObj } from "@storybook/vue3-vite";

import { demo } from "../../demo/story";
import AkButton from "../Button/AkButton.vue";
import AkCard from "../Card/AkCard.vue";
import AkScope from "./AkScope.vue";
import ThemeDemo from "./demos/Theme.vue";

const meta = {
  title: "Components/Scope",
  component: AkScope,
  tags: ["autodocs"],
  args: { theme: "light", tag: "div" },
  argTypes: {
    theme: { control: "inline-radio", options: [undefined, "light", "dark"] },
  },
  render: args => ({
    components: { AkScope, AkCard, AkButton },
    setup: () => ({ args }),
    template: `<AkScope v-bind="args" class="ak-p-4">
      <AkCard eyebrow="Scope" title="作用域里的卡片">
        <p class="ak-fs-sm ak-fg-2 ak-mb-0">切换工具栏的主题：不传 theme 时跟随页面，传了就固定。</p>
        <template #footer><AkButton size="sm" variant="primary">确认</AkButton></template>
      </AkCard>
    </AkScope>`,
  }),
} satisfies Meta<typeof AkScope>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};
export const Theme: Story = { name: "局部主题", ...demo(ThemeDemo) };
