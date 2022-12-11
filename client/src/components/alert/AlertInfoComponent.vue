<template>
  <div class="alert alert-primary d-flex align-items-center alert-dismissible fade show" role="alert">
    <img class="bi flex-shrink-0 me-2" aria-label="Info:" :src="info_svg" alt="img_info" />
    <div>
      <strong>{{ $t('common.alert.info') }} </strong>
      <slot></slot>
      <button type="button" class="btn-close" @click="store.hide_alert()" aria-label="Close"></button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { store } from "@/util/store";
import info_svg from "@/assets/svg/info-circle-fill.svg";
</script>

<style scoped>
.alert {
  width: min(90vw, 600px);
  margin: 20px auto;
}
</style>