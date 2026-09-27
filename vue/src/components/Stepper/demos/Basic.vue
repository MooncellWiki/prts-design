<script setup lang="ts">
import AkStep from "../AkStep.vue";
import AkSteps from "../AkSteps.vue";
</script>

<template>
  <AkSteps :current="3" label="精英化进度">
    <AkStep title="精英零" />
    <AkStep title="精英一" />
    <AkStep title="精英二" />
    <AkStep title="满级" />
  </AkSteps>
</template>
