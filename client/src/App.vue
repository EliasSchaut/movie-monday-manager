<template>
  <header>
    <NavbarComponent />
  </header>

  <AlertComponent />
  <WatchlistComponent />
  <router-view />
</template>

<script setup lang="ts">
import NavbarComponent from "@/components/NavbarComponent.vue";
import AlertComponent from "@/components/alert/AlertComponent.vue";
import WatchlistComponent from "@/components/WatchlistComponent.vue";
</script>

<style scoped>

</style>
