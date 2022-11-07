<template>
  <header>
    <NavbarComponent />
  </header>

  <AlertComponent />
  <router-view />
</template>

<script setup lang="ts">
import NavbarComponent from "@/components/NavbarComponent.vue";
import AlertComponent from "@/components/err/AlertComponent.vue";
</script>

<script lang="ts">
export default {
  name: "App",
};
</script>

<style scoped>

</style>
