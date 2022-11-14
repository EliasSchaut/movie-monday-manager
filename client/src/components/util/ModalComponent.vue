<template>
  <div :id="id" class="modal fade" tabindex="-1" aria-hidden="true">
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title">{{ title }}</h5>
          <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
        </div>
        <div class="modal-body">
          <slot />
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
export default {
  name: "CardComponent",
  props: {
    title: {
      type: String,
      required: true,
    },
    id: {
      type: String,
      required: true
    }
  },
};
</script>

<style scoped>

</style>