<script setup lang="ts">
import AkTag from "../../Tag/AkTag.vue";
import AkKv from "../AkKv.vue";
import AkKvItem from "../AkKvItem.vue";
</script>

<template>
  <div class="ak-flex-col ak-gap-4">
    <!-- 干员页「获得方式」 -->
    <AkKv inline>
      <AkKvItem term="获得方式"><AkTag>公开招募</AkTag> <AkTag>中坚寻访</AkTag></AkKvItem>
      <AkKvItem term="上线时间">2019年7月9日 16:00</AkKvItem>
    </AkKv>
    <!-- 干员页「属性」节的表脚：键带悬停解释时用 #term 插槽 -->
    <AkKv inline>
      <AkKvItem term="所属势力">
        <a href="#">炎-龙门</a> <span class="ak-fg-subtle">›</span> <a href="#">龙门近卫局</a>
      </AkKvItem>
      <AkKvItem>
        <template #term><span class="ak-term" data-ak-tip="仅在战斗中所使用的数据" tabindex="0">隐藏势力</span></template>
        <i class="ak-fg-muted">无</i>
      </AkKvItem>
    </AkKv>
  </div>
</template>
