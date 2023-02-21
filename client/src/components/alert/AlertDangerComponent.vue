<template>
  <div class="alert alert-danger d-flex align-items-center alert-dismissible fade show" role="alert">
    <img class="bi flex-shrink-0 me-2" aria-label="Danger:" :src="warn_svg" alt="img_danger" />
    <div>
      <strong>{{ $t('common.alert.danger') }} </strong>
      <slot></slot>
      <button type="button" class="btn-close" @click="store.hide_alert()" aria-label="Close"></button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { store } from "@/util/store";
import warn_svg from "@/assets/svg/exclamation-triangle-fill.svg";
</script>

<style scoped>
.alert {
  width: min(90vw, 600px);
  margin: 20px auto;
}
</style>