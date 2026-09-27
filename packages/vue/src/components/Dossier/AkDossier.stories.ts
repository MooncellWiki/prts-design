import type { Meta, StoryObj } from "@storybook/vue3-vite";

import { demo } from "../../demo/story";
import AkDossier from "./AkDossier.vue";
import AkRedacted from "./AkRedacted.vue";
import BasicDemo from "./demos/Basic.vue";
import FilesDemo from "./demos/Files.vue";
import LockedDemo from "./demos/Locked.vue";

const meta = {
  title: "Arknights/Dossier",
  component: AkDossier,
  subcomponents: { AkRedacted },
  tags: ["autodocs"],
  args: { title: "档案资料一", en: "Archive 1", unlock: "提升信赖至50%以查看更多信息", locked: false },
  render: args => ({
    components: { AkDossier, AkRedacted },
    setup: () => ({ args }),
    template: `<AkDossier v-bind="args">
  <p><b>【源石技艺概览】</b><br>陈从来不在人前使用源石技艺，这使得大多数人都认为陈不善此道。</p>
  <p><AkRedacted>【应龙门近卫局要求，不予公开】</AkRedacted></p>
</AkDossier>`,
  }),
} satisfies Meta<typeof AkDossier>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};
export const Basic: Story = { name: "档案条目 + 涂黑", ...demo(BasicDemo) };
export const Locked: Story = { name: "未解锁", ...demo(LockedDemo) };
export const Files: Story = { name: "人员档案（竖排标签页）", ...demo(FilesDemo) };
