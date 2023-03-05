<template>
  <div class="card text-center">
    <div v-if="header !== ''" class="card-header">
      {{ header }}
    </div>
    <slot v-if="nobody" />
    <div v-else class="card-body">
      <slot />
    </div>
    <div v-if="footer !== ''" class="card-footer text-muted">
      {{ footer }}
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  name: "CardComponent",
  props: {
    header: {
      type: String,
      default: ""
    },
    footer: {
      type: String,
      default: ""
    },
    nobody: {
      type: Boolean,
      default: false
    }
  }
});
</script>

<style scoped>

</style>