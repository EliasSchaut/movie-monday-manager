<template>
  <div :id="id" class="modal fade" tabindex="-1" aria-hidden="true">
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title">{{ title }}</h5>
          <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
        </div>
        <slot v-if="spawn_over_body" />
        <div v-else class="modal-body">
          <slot />
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  name: "CardComponent",
  props: {
    title: {
      type: String,
      required: true,
    },
    id: {
      type: String,
      required: true
    },
    spawn_over_body: {
      type: Boolean,
      default: false
    }
  },
});
</script>

<style scoped>

</style>