<script setup lang="ts">
import AkRichText from "../AkRichText.vue";

/** gamedata_const.richTextStyles 里常用的几种：原始标记 → 渲染结果 */
const samples = [
  { tag: "<@ba.vup>", text: "攻击力<@ba.vup>+50%</>" },
  { tag: "<@ba.vdown>", text: "防御力<@ba.vdown>-30%</>" },
  { tag: "<@ba.rem>", text: "造成<@ba.rem>法术</>伤害" },
  { tag: "<@ba.kw>", text: "普通攻击连续造成<@ba.kw>两次</>伤害" },
  { tag: "<@ba.talpu>", text: "攻击力+6%<@ba.talpu>（+1%）</>" },
  { tag: "<$ba.stun>", text: "令目标<$ba.stun>晕眩</>1.5秒" },
  { tag: "<@tu.imp>", text: "<@tu.imp>注意：</>本关卡无法撤退" },
  { tag: "<@ba.enemy>", text: "<@ba.enemy>敌方</>单位" },
  { tag: "<@ba.gild>", text: "<@ba.gild>镀层</>" },
  { tag: "<@mission.levelname>", text: "通关<@mission.levelname>1-7</>" },
];
const terms = { "ba.stun": "晕眩：无法移动、阻挡、攻击及使用技能" };
</script>

<template>
  <table class="wikitable ak-compact">
    <thead>
      <tr><th>标签</th><th>原始标记</th><th>渲染</th></tr>
    </thead>
    <tbody>
      <tr v-for="s in samples" :key="s.tag">
        <td><code>{{ s.tag }}</code></td>
        <td><code>{{ s.text }}</code></td>
        <td><AkRichText :text="s.text" :terms="terms" /></td>
      </tr>
    </tbody>
  </table>
</template>
