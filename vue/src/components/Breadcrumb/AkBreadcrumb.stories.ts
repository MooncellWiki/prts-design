import type { Meta, StoryObj } from "@storybook/vue3-vite";

import { demo } from "../../demo/story";
import AkBreadcrumb from "./AkBreadcrumb.vue";
import AkBreadcrumbItem from "./AkBreadcrumbItem.vue";
import BasicDemo from "./demos/Basic.vue";

const meta = {
  title: "Components/Breadcrumb",
  component: AkBreadcrumb,
  subcomponents: { AkBreadcrumbItem },
  tags: ["autodocs"],
  args: { label: "面包屑" },
  render: args => ({
    components: { AkBreadcrumb, AkBreadcrumbItem },
    setup: () => ({ args }),
    template: `<AkBreadcrumb v-bind="args">
  <AkBreadcrumbItem href="#首页">首页</AkBreadcrumbItem>
  <AkBreadcrumbItem href="#干员一览">干员一览</AkBreadcrumbItem>
  <AkBreadcrumbItem>陈</AkBreadcrumbItem>
</AkBreadcrumb>`,
  }),
} satisfies Meta<typeof AkBreadcrumb>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};
export const Basic: Story = { name: "基本", ...demo(BasicDemo) };
