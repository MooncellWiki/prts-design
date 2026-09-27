import type { Meta, StoryObj } from "@storybook/vue3-vite";

import { asset } from "../../demo/asset";
import { demo } from "../../demo/story";
import AkPotential from "./AkPotential.vue";
import AkSpecialization from "./AkSpecialization.vue";
import PotentialsDemo from "./demos/Potentials.vue";
import SpecializationDemo from "./demos/Specialization.vue";

const meta = {
  title: "Arknights/Potential",
  component: AkPotential,
  subcomponents: { AkSpecialization },
  tags: ["autodocs"],
  args: { src: asset("potential/potential_5.png"), value: 6, bare: false },
  argTypes: {
    value: { control: "inline-radio", options: [1, 2, 3, 4, 5, 6] },
  },
  render: args => ({ components: { AkPotential }, setup: () => ({ args }), template: '<AkPotential v-bind="args" />' }),
} satisfies Meta<typeof AkPotential>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};
export const Potentials: Story = { name: "潜能 1–6", ...demo(PotentialsDemo) };
export const Specialization: Story = { name: "专精", ...demo(SpecializationDemo) };
