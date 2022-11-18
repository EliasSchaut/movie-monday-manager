<template>
  <header>
    <NavbarComponent />
  </header>

  <AlertComponent />
  <router-view />
</template>

<script setup lang="ts">
import NavbarComponent from "@/components/NavbarComponent.vue";
import AlertComponent from "@/components/alert/AlertComponent.vue";
</script>

<style scoped>

</style>
