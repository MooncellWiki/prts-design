<script setup lang="ts">
import { ref } from "vue";

import AkButton from "../../Button/AkButton.vue";
import AkMessage from "../AkMessage.vue";

const show = ref(true);
</script>

<template>
  <div>
    <AkMessage v-model="show" title="数据版本" closable>本页数据取自游戏版本 2.7.61，与现网 wikitext 同步。</AkMessage>
    <AkButton v-if="!show" size="sm" @click="show = true">重新显示</AkButton>
    <AkMessage variant="warning" closable>
      <template #header>存在<a href="#">待合并的编辑</a></template>
      另一位编辑者在你打开本页之后保存过修改。
    </AkMessage>
  </div>
</template>
