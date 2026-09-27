<script setup lang="ts">
import AkAttr from "../AkAttr.vue";
import AkAttrs from "../AkAttrs.vue";
</script>

<template>
  <div class="ak-flex-col ak-gap-4">
    <AkAttrs compact>
      <AkAttr name="HP" :value="2880" />
      <AkAttr name="ATK" :value="610" />
      <AkAttr name="DEF" :value="352" />
    </AkAttrs>
    <!-- 人员档案「综合体检测试」：中文属性名；要上色的值写在默认插槽里 -->
    <AkAttrs compact>
      <AkAttr name="物理强度" value="优良" />
      <AkAttr name="战场机动" value="标准" />
      <AkAttr name="生理耐受" value="优良" />
      <AkAttr name="战术规划" value="优良" />
      <AkAttr name="战斗技巧"><span class="ak-fg-accent">卓越</span></AkAttr>
      <AkAttr name="源石技艺适应性" value="标准" />
    </AkAttrs>
  </div>
</template>
