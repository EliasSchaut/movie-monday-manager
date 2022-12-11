<template>
  <div class="alert alert-success d-flex align-items-center alert-dismissible fade show" role="alert">
    <img class="bi flex-shrink-0 me-2" aria-label="Success:" :src="check_svg" alt="img_success" />
    <div>
      <strong>{{ $t('common.alert.success') }} </strong>
      <slot></slot>
      <button type="button" class="btn-close" @click="store.hide_alert()" aria-label="Close"></button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { store } from "@/util/store";
import check_svg from "@/assets/svg/check-circle-fill.svg";
</script>

<style scoped>
.alert {
  width: min(90vw, 600px);
  margin: 20px auto;
}
</style>