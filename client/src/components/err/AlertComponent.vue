<template>
  <div style="display: none">
    <div class="alert alert-primary d-flex align-items-center alert-dismissible fade show" role="alert">
      <img class="bi flex-shrink-0 me-2" aria-label="Info:" :src="info_svg" alt="img_info" />
      <div>
        <strong>Info!</strong>
        <slot></slot>
        <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
      </div>
    </div>

    <div class="alert alert-success d-flex align-items-center alert-dismissible fade show" role="alert">
      <img class="bi flex-shrink-0 me-2" aria-label="Success:" :src="check_svg" alt="img_success" />
      <div>
        <strong>Success!</strong>
        <slot></slot>
        <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
      </div>
    </div>

    <div class="alert alert-warning d-flex align-items-center alert-dismissible fade show" role="alert">
      <img class="bi flex-shrink-0 me-2" aria-label="Warning:" :src="warn_svg" alt="img_warn" />
      <div>
        <strong>Warning!</strong>
        <slot></slot>
        <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
      </div>
    </div>

    <div class="alert alert-danger d-flex align-items-center alert-dismissible fade show" role="alert">
      <img class="bi flex-shrink-0 me-2" aria-label="Danger:" :src="warn_svg" alt="img_danger" />
      <div>
        <strong>Danger!</strong>
        <slot></slot>
        <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import check_svg from "@/assets/svg/check-circle-fill.svg";
import warn_svg from "@/assets/svg/exclamation-triangle-fill.svg";
import info_svg from "@/assets/svg/info-circle-fill.svg";
</script>

<script lang="ts">
export default {
  name: "AlertComponent"
};
</script>

<style scoped>
.alert {
  width: min(90vw, 600px);
  margin: 20px auto;
}
</style>