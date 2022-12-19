<template>
  <div class="alert alert-warning d-flex align-items-center alert-dismissible fade show" role="alert">
    <img class="bi flex-shrink-0 me-2" aria-label="Warning:" :src="warn_svg" alt="img_warn" />
    <div>
      <strong>{{ $t('common.alert.warning') }} </strong>
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