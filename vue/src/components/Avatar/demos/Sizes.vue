<script setup lang="ts">
import { asset } from "../../../demo/asset";
import AkAvatar from "../AkAvatar.vue";
</script>

<template>
  <div class="ak-flex ak-wrap ak-gap-3 ak-items-center">
    <AkAvatar size="xs" :src="asset('avatar/char_002_amiya_1p.png')" alt="阿米娅" />
    <AkAvatar size="sm" :src="asset('avatar/char_003_kalts_2.png')" alt="凯尔希" />
    <AkAvatar :src="asset('avatar/char_010_chen_2.png')" alt="陈" status />
    <AkAvatar size="lg" :src="asset('avatar/char_172_svrash_2.png')" alt="银灰" />
    <AkAvatar size="xl" round :src="asset('avatar/char_103_angel_2.png')" alt="能天使" />
    <AkAvatar>DR</AkAvatar>
    <AkAvatar size="lg">PRTS</AkAvatar>
  </div>
</template>
