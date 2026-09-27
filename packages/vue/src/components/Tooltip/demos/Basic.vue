<script setup lang="ts">
import AkButton from "../../Button/AkButton.vue";
import AkTooltip from "../AkTooltip.vue";

const effects = [
  { name: "无敌", tip: "无敌：无法被不同阵营选中（属于无法选择类效果）；受到的伤害与元素值变为 0；无法触发任何单位未绑定选择器的能力" },
  { name: "不可阻挡", tip: "不可阻挡：无法阻挡 / 被阻挡，自动解除阻挡" },
  { name: "晕眩免疫", tip: "晕眩免疫：使自身的晕眩失效，但不会清除相关 Buff" },
];
</script>

<template>
  <div class="ak-flex-col ak-gap-4 ak-p-4">
    <div class="ak-flex ak-wrap ak-gap-3 ak-items-center">
      <AkTooltip>
        <template #trigger><AkButton variant="outline">攻击回复</AkButton></template>
        每次攻击回复1点技力
      </AkTooltip>
      <AkTooltip>
        <template #trigger><AkButton icon="star" variant="ghost">监视</AkButton></template>
        将本页面加入您的监视列表
      </AkTooltip>
      <AkTooltip trigger="click">
        <template #trigger><AkButton variant="ghost">点击显示</AkButton></template>
        再点一次、点外面或按 Esc 收起
      </AkTooltip>
    </div>
    <!-- 术语：.ak-term 虚线下划线；span 不可聚焦，AkTooltip 自动补 tabindex="0" -->
    <p class="ak-m-0">
      技能生效期间，持有效果：<template v-for="(e, i) in effects" :key="e.name">{{ i ? "、" : "" }}<AkTooltip>
          <template #trigger><span class="ak-term">{{ e.name }}</span></template>
          {{ e.tip }}
        </AkTooltip></template>
    </p>
  </div>
</template>
