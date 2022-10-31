<template>
  <header>
    <NavbarComponent />
  </header>

  <router-view />
</template>

<script setup lang="ts">
import NavbarComponent from "@/components/util/NavbarComponent.vue";
</script>
<!--
<script lang="ts">
  import { ref } from "vue";
  import { onBeforeRouteUpdate } from "vue-router";
  const logged_in = ref(false);
  const loading = ref(false);

  export default {
    data() {
      return {
        logged_in: logged_in,
        loading: loading,
      };
    }
  }

  onBeforeRouteUpdate(async (to, from, next) => {
    (await fetch("api/profile/check", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Authorization": "Bearer " + localStorage.getItem("access_token")
      }
    })).status === 200 ? logged_in.value = true : logged_in.value = false;
    next();
  });
</script>
-->
<style scoped>

</style>
