<template>
  <component v-if="store.alert.show" :is="tabs[store.alert.type]">
    <br>{{ store.alert.msg }}
  </component>
</template>

<script setup lang="ts">
import { store } from "@/components/ts/store";

import AlertInfoComponent from "@/components/alert/AlertInfoComponent.vue";
import AlertDangerComponent from "@/components/alert/AlertDangerComponent.vue";
import AlertWarningComponent from "@/components/alert/AlertWarningComponent.vue";
import AlertSuccessComponent from "@/components/alert/AlertSuccessComponent.vue";

const tabs = {
  "info": AlertInfoComponent,
  "danger": AlertDangerComponent,
  "warning": AlertWarningComponent,
  "success": AlertSuccessComponent
}
</script>

<style scoped>

</style>