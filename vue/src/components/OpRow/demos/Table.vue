<script setup lang="ts">
import { asset } from "../../../demo/asset";
import AkTag from "../../Tag/AkTag.vue";
import AkOpRow from "../AkOpRow.vue";
</script>

<template>
  <!-- 表格里：第一列放条目，#meta 插槽放标签 -->
  <table class="wikitable">
    <thead>
      <tr><th>干员</th><th>职业</th><th>获得方式</th></tr>
    </thead>
    <tbody>
      <tr>
        <td><AkOpRow name="陈" :avatar="asset('avatar/char_010_chen_2.png')" :rarity="6" meta="剑豪" stars href="#" /></td>
        <td>近卫</td>
        <td>中坚寻访</td>
      </tr>
      <tr>
        <td>
          <AkOpRow name="阿米娅" :avatar="asset('avatar/char_002_amiya_1p.png')" :rarity="5" href="#">
            <template #meta><AkTag size="sm" variant="accent-soft">主线</AkTag> 中坚术师</template>
          </AkOpRow>
        </td>
        <td>术师</td>
        <td>主线剧情</td>
      </tr>
    </tbody>
  </table>
</template>
