<script setup lang="ts">
import AkRedacted from "../../Dossier/AkRedacted.vue";
import AkDialogue from "../AkDialogue.vue";
import AkDialogueLine from "../AkDialogueLine.vue";

/** 人员档案「档案资料四 · 权限记录」：说话人身份是剧透，涂黑 */
const record = [
  "你的父亲已经和你断绝关系。他同样也和我再无瓜葛，我不会在乎，他也不会。",
  "你想离开这里？",
  "可以。不过在那之前，我要说些事情给你听。",
  "——其实我知道那个老人是谁。",
];
</script>

<template>
  <div class="ak-flex-col ak-gap-6">
    <section>
      <div class="ak-overline ak-mb-3">信赖提升后交谈</div>
      <AkDialogue>
        <AkDialogueLine speaker="陈">也许有一天我会得到<AkRedacted>那个人</AkRedacted>的认可，在那之前......</AkDialogueLine>
        <AkDialogueLine speaker="陈">我......我从没试过去毫无保留地相信一个人，即使是<AkRedacted>那个人</AkRedacted>也......</AkDialogueLine>
      </AkDialogue>
    </section>
    <section>
      <div class="ak-overline ak-mb-3">档案资料四 · 权限记录</div>
      <AkDialogue>
        <AkDialogueLine v-for="(line, i) in record" :key="i">
          <template #speaker><AkRedacted>魏彦吾</AkRedacted></template>
          {{ line }}
        </AkDialogueLine>
        <AkDialogueLine>......模拟结束......正在回到主界面......</AkDialogueLine>
      </AkDialogue>
    </section>
  </div>
</template>
