<script setup lang="ts">
import AkSkeleton from "../AkSkeleton.vue";
</script>

<template>
  <div class="ak-grid ak-grid-2 ak-gap-6 ak-items-start">
    <div>
      <AkSkeleton :height="120" class="ak-mb-2" />
      <AkSkeleton text :repeat="3" />
    </div>
    <div class="ak-flex ak-gap-4 ak-items-center">
      <AkSkeleton circle :width="56" />
      <AkSkeleton square :width="56" />
      <AkSkeleton :width="120" :height="36" />
    </div>
  </div>
</template>
