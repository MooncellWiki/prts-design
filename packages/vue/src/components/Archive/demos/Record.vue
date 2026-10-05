<script setup lang="ts">
import { asset } from "../../../demo/asset";
import AkItem from "../../Item/AkItem.vue";
import AkItemList from "../../Item/AkItemList.vue";
import AkArchive from "../AkArchive.vue";
import AkArchivePlay from "../AkArchivePlay.vue";

const paradox = `无论什么时候，陈总是会站在队伍的前端。
一开始，她的同事们以为她是不自量力，她也确实为此付出过一些代价。但是当陈逐渐掌握运用赤霄之后，她的同事们开始主动为她留出场地。
一是，他们不想自己被出鞘的赤霄卷进去。二是，他们已经知道，如果陈说她做得到，她就会做到。这并不是说她无所不能，而是因为她决不放弃。`;
</script>

<template>
  <div class="ak-flex-col">
    <!-- 干员密录：解锁条件同现网——精英化图标 + Lv.1、信赖图标 + 50%，不加小标；页脚是「阅读密录」 -->
    <AkArchive title="一鼓作气" unlock-label="">
      <template #unlock>
        <span class="ak-elite" title="精英二 1 级"><img :src="asset('elite/upgrade_2.png')" alt="精英二" />Lv.1</span>
        <span class="ak-trust">50%</span>
      </template>
      <p><i>一鼓作气，再而衰。</i></p>
      <template #footer>
        <span class="ak-archive__group">
          <span class="ak-overline">Story</span>
          <AkArchivePlay href="#" title="陈/干员密录/1">阅读密录 · 一鼓作气</AkArchivePlay>
        </span>
        <span class="ak-fg-muted">蚀刻章 medal_story_chen_1 · 光荣之路</span>
      </template>
    </AkArchive>
    <!-- 悖论模拟：页脚是关卡 + 首通奖励；小标与内容包 .ak-archive__group，窄屏整组换行 -->
    <AkArchive title="永不后退" unlock-label="">
      <template #unlock>
        <span class="ak-elite" title="精英二 1 级"><img :src="asset('elite/upgrade_2.png')" alt="精英二" />Lv.1</span>
      </template>
      <p>{{ paradox }}</p>
      <p><b>&lt;活性源石&gt;</b> 部署于其上的我军和经过的敌军持续受到伤害，但攻击力和攻速大幅度提升</p>
      <template #footer>
        <span class="ak-archive__group">
          <span class="ak-overline">关卡</span>
          <AkArchivePlay href="#">悖论模拟 · 永不后退</AkArchivePlay>
        </span>
        <span class="ak-archive__group">
          <span class="ak-overline">首次通关奖励</span>
          <AkItemList>
            <AkItem :src="asset('item/framed/4003.png')" name="合成玉" :count="200" size="sm" />
          </AkItemList>
        </span>
      </template>
    </AkArchive>
  </div>
</template>
