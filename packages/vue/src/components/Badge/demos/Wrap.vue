<script setup lang="ts">
import { ref } from "vue";

import { asset } from "../../../demo/asset";
import AkAvatar from "../../Avatar/AkAvatar.vue";
import AkButton from "../../Button/AkButton.vue";
import AkBadge from "../AkBadge.vue";

const unread = ref(3);
</script>

<template>
  <div class="ak-flex ak-wrap ak-gap-6 ak-items-center">
    <AkBadge :value="unread" :label="`${unread} 条未读通知`">
      <AkButton icon="bell" label="通知" variant="ghost" />
    </AkBadge>
    <AkBadge dot label="有新的讨论">
      <AkButton icon="talk" label="讨论" variant="ghost" />
    </AkBadge>
    <AkBadge :value="12" label="12 项监视列表更新">
      <AkAvatar size="lg" :src="asset('avatar/char_002_amiya_1p.png')" alt="阿米娅" />
    </AkBadge>
    <AkBadge :value="128" :max="99" variant="danger" label="超过 99 条回退提醒">
      <AkAvatar>DR</AkAvatar>
    </AkBadge>
    <AkButton size="sm" @click="unread = unread ? 0 : 3">{{ unread ? "全部已读" : "来一条新通知" }}</AkButton>
  </div>
</template>
