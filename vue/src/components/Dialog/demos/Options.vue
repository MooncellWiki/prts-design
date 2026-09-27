<script setup lang="ts">
import { ref } from "vue";

import AkButton from "../../Button/AkButton.vue";
import AkDialog from "../AkDialog.vue";

const small = ref(false);
const large = ref(false);
const confirm = ref(false);
</script>

<template>
  <!-- 示例框留出对话框的高度：模态对话框在示例 iframe 的视口里居中 -->
  <div class="ak-flex ak-wrap ak-gap-3 ak-items-start" style="min-height: 360px">
    <AkButton @click="small = true">小（sm）</AkButton>
    <AkButton @click="large = true">大（lg）</AkButton>
    <AkButton variant="danger" @click="confirm = true">删除页面…</AkButton>

    <AkDialog v-model="small" size="sm" title="保存失败">会话已过期，请重新登录后再保存。你的修改仍保留在编辑框里。</AkDialog>

    <AkDialog v-model="large" size="lg" title="引用此页">
      <p>请按所需格式引用本页（修订版本 #271828，最后编辑于 2026-09-27 12:00）：</p>
      <pre>PRTS. 陈 [DB/OL]. prts.wiki, 2026-09-27.</pre>
    </AkDialog>

    <!-- 不可逆的动作：不给遮罩 / Esc 关，必须明确点一个按钮；底栏用 #footer 自己放 -->
    <AkDialog v-model="confirm" size="sm" :closable="false" :mask-closable="false" :close-on-esc="false">
      <template #header>删除「干员异格任务」？</template>
      页面及其全部 42 个修订版本将被删除，只有管理员可以恢复。
      <template #footer>
        <AkButton @click="confirm = false">保留</AkButton>
        <AkButton variant="danger" stripes @click="confirm = false">删除</AkButton>
      </template>
    </AkDialog>
  </div>
</template>
