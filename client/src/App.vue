<template>
  <header>
    <NavbarComponent />
  </header>

  <router-view />
</template>

<script setup lang="ts">
import NavbarComponent from "@/components/NavbarComponent.vue";
</script>

<script lang="ts">
export default {
  name: "App",
};
</script>

<style scoped>

</style>
