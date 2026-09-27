<script setup lang="ts">
import { ref } from "vue";

import { asset } from "../../../demo/asset";
import AkAvatar from "../../Avatar/AkAvatar.vue";
import AkButton from "../../Button/AkButton.vue";
import AkSkeleton from "../AkSkeleton.vue";

const loading = ref(true);
const ops = [
  { name: "陈", meta: "剑豪 · LM04", avatar: asset("avatar/char_010_chen_2.png") },
  { name: "银灰", meta: "领主 · KJ01", avatar: asset("avatar/char_172_svrash_2.png") },
  { name: "德克萨斯", meta: "尖兵 · PL03", avatar: asset("avatar/char_102_texas_2.png") },
];
</script>

<template>
  <div class="ak-flex-col ak-gap-4 ak-items-start">
    <AkButton size="sm" @click="loading = !loading">{{ loading ? "加载完成" : "重新加载" }}</AkButton>
    <div class="ak-flex-col ak-gap-3 ak-w-full" role="list" :aria-busy="loading" aria-label="干员列表">
      <div v-for="op in ops" :key="op.name" class="ak-flex ak-gap-3 ak-items-center" role="listitem">
        <template v-if="loading">
          <AkSkeleton square :width="40" />
          <div class="ak-grow">
            <AkSkeleton text :width="64" />
            <AkSkeleton text :width="112" />
          </div>
        </template>
        <template v-else>
          <AkAvatar :src="op.avatar" />
          <div class="ak-grow">
            <div class="ak-fw-700">{{ op.name }}</div>
            <div class="ak-fs-xs ak-fg-muted">{{ op.meta }}</div>
          </div>
        </template>
      </div>
    </div>
  </div>
</template>
