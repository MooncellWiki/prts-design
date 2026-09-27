<script setup lang="ts">
/** Vue 组件的 props / 事件 / 插槽表：数据来自 virtual:akds-meta（vue-component-meta 读 TS 类型 + JSDoc），不手写 */
import meta from "virtual:akds-meta";
import { computed } from "vue";

const props = defineProps<{ of: string }>();
const doc = computed(() => meta[props.of]);
</script>

<template>
  <div v-if="doc" class="akd-props">
    <table>
      <thead>
        <tr><th>属性</th><th>类型</th><th>默认</th><th>说明</th></tr>
      </thead>
      <tbody>
        <tr v-for="p in doc.props" :key="p.name">
          <td><code>{{ p.name }}</code><span v-if="p.required" class="akd-props__req">必填</span></td>
          <td>
            <span v-if="p.values" class="akd-props__values"><code v-for="v in p.values" :key="v">{{ v }}</code></span>
            <code v-else>{{ p.type }}</code>
          </td>
          <td><code v-if="p.default">{{ p.default }}</code><span v-else class="akd-props__none">—</span></td>
          <td>{{ p.description }}</td>
        </tr>
      </tbody>
    </table>
    <table v-if="doc.events.length">
      <thead>
        <tr><th>事件</th><th>参数</th><th>说明</th></tr>
      </thead>
      <tbody>
        <tr v-for="e in doc.events" :key="e.name">
          <td><code>{{ e.name }}</code></td>
          <td><code>{{ e.signature }}</code></td>
          <td>{{ e.description }}</td>
        </tr>
      </tbody>
    </table>
    <table v-if="doc.slots.length">
      <thead>
        <tr><th>插槽</th><th>说明</th></tr>
      </thead>
      <tbody>
        <tr v-for="s in doc.slots" :key="s.name">
          <td><code>{{ s.name }}</code></td>
          <td>{{ s.description }}</td>
        </tr>
      </tbody>
    </table>
  </div>
  <p v-else class="akd-props__none">没有 {{ of }} 的元数据</p>
</template>
