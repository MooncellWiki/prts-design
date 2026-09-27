<script setup lang="ts">
import { asset } from "../../../demo/asset";
import AkRichText from "../../RichText/AkRichText.vue";
import AkTalent from "../AkTalent.vue";

/** 陈的两个天赋（精英二满潜能时的效果） */
const e2 = { icon: asset("elite/elite_2.png"), text: "精英二 · 1级" };
</script>

<template>
  <div>
    <AkTalent name="呵斥" :requirements="[e2]">在场时每4秒回复全场友方角色1点攻击/受击技力</AkTalent>
    <AkTalent name="持刀格斗术" :requirements="[e2, { icon: asset('potential/potential_4.png'), text: '潜能5' }]">
      <AkRichText text="攻击力+6%<@ba.talpu>（+1%）</>，防御力+6%<@ba.talpu>（+1%）</>，物理闪避+13%<@ba.talpu>（+3%）</>" />
    </AkTalent>
  </div>
</template>
