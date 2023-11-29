<template>
  <UserCircleIcon
    class="h-10 w-10 text-gray-300 dark:text-gray-400"
    aria-hidden="true"
  />
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { UserCircleIcon } from '@heroicons/vue/24/solid';

export default defineComponent({
  name: 'IconAvatar',
  components: { UserCircleIcon },
});
</script>
