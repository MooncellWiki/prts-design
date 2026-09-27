<script setup lang="ts">
import { defineComponent, h } from "vue";

import AkButton from "../../Button/AkButton.vue";
import AkToastProvider from "../AkToastProvider.vue";
import { useToast } from "../useToast";

/** 实际项目里这是 AkToastProvider 里面的任意子组件：useToast() 要在 provider 的后代里调用 */
const Actions = defineComponent(() => {
  const toast = useToast();
  const button = (text: string, onClick: () => void) => h(AkButton, { onClick }, () => text);
  return () =>
    h("div", { class: "ak-flex ak-wrap ak-gap-3" }, [
      button("信息", () => toast.info("本页数据取自游戏版本 2.7.61")),
      button("成功", () => toast.success("页面已加入监视列表", { title: "完成" })),
      button("警告", () => toast.warning("本页含未实装内容，数据可能变动")),
      button("失败", () => toast.error("保存失败：会话过期")),
    ]);
});
</script>

<template>
  <!-- 示例框留出高度：提示栈固定在示例 iframe 视口的右下角 -->
  <div style="min-height: 260px">
    <AkToastProvider>
      <Actions />
    </AkToastProvider>
  </div>
</template>
