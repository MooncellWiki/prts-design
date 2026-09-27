<script setup lang="ts">
import { ref } from "vue";

import AkCheckbox from "../../Checkbox/AkCheckbox.vue";
import AkCheckboxGroup from "../../Checkbox/AkCheckboxGroup.vue";
import AkInputNumber from "../../InputNumber/AkInputNumber.vue";
import AkRadio from "../../Radio/AkRadio.vue";
import AkRadioGroup from "../../Radio/AkRadioGroup.vue";
import AkSwitch from "../../Switch/AkSwitch.vue";
import AkField from "../AkField.vue";

const obtain = ref(["recruit"]);
const position = ref("melee");
const trust = ref(100);
const potential = ref(true);
</script>

<template>
  <div class="ak-grid-2 ak-gap-6">
    <AkField label="获得方式" feedback="可多选">
      <AkCheckboxGroup v-model="obtain">
        <AkCheckbox value="recruit">公开招募</AkCheckbox>
        <AkCheckbox value="standard">标准寻访</AkCheckbox>
        <AkCheckbox value="limited">限定寻访</AkCheckbox>
        <AkCheckbox value="event">活动获得</AkCheckbox>
      </AkCheckboxGroup>
    </AkField>
    <AkField label="部署位置" required>
      <AkRadioGroup v-model="position">
        <AkRadio value="melee">近战位</AkRadio>
        <AkRadio value="ranged">远程位</AkRadio>
      </AkRadioGroup>
    </AkField>
    <AkField label="信赖（%）">
      <AkInputNumber v-model="trust" :min="0" :max="200" :step="10" />
    </AkField>
    <AkField label="潜能加成">
      <AkSwitch v-model="potential">
        <template #checked>按满潜能计算</template>
        <template #unchecked>按 1 潜能计算</template>
      </AkSwitch>
    </AkField>
  </div>
</template>
