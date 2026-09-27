<script setup lang="ts">
import AkStat from "../AkStat.vue";
import AkStatRow from "../AkStatRow.vue";
</script>

<template>
  <AkStatRow>
    <AkStat label="Operators" :value="356" delta="+4 本月" />
    <AkStat label="Stages" value="1,204" />
    <AkStat label="Edits / 24h" value="2.3" delta="-12%">
      <template #suffix>k</template>
    </AkStat>
  </AkStatRow>
</template>
