<script setup lang="ts">
import AkSp from "../AkSp.vue";
import AkSpTrigger from "../AkSpTrigger.vue";
</script>

<template>
  <div class="ak-flex-col ak-gap-3">
    <div class="ak-flex ak-wrap ak-gap-2 ak-items-center">
      <AkSp />
      <AkSp sp-type="attack" />
      <AkSp sp-type="hit" />
      <AkSp sp-type="passive" />
    </div>
    <div class="ak-flex ak-wrap ak-gap-2 ak-items-center">
      <AkSpTrigger />
      <AkSpTrigger auto />
    </div>
  </div>
</template>
