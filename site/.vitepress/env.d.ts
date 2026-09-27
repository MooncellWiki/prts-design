/// <reference types="vite/client" />
declare module "virtual:akds-meta" {
  import type { ComponentDoc } from "./plugins/meta";
  const meta: Record<string, ComponentDoc>;
  export default meta;
}
