<template>
  <Body class="bg-white dark:bg-gray-800" />
  <div>
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
  </div>
</template>

<script setup lang="ts">
import { authStore } from '~/store/auth';

const auth = authStore();
</script>
