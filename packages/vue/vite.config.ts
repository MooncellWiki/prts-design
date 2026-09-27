import vue from "@vitejs/plugin-vue";
import { defineConfig } from "vite";

/** 库构建：dist/index.js（ESM，vue 外置）；类型由 vue-tsc -p tsconfig.build.json 另出。不打包 CSS——样式由皮肤提供（仓库里是 packages/css） */
export default defineConfig({
  plugins: [vue()],
  build: {
    lib: { entry: "src/index.ts", formats: ["es"], fileName: "index" },
    rollupOptions: { external: ["vue"] },
    sourcemap: true,
    minify: false,
  },
});
