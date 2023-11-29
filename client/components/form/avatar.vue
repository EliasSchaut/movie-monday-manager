<template>
  <div class="col-span-full">
    <label
      :for="id"
      class="block text-sm font-medium leading-6 text-gray-900 dark:text-white"
      >{{ label }}</label
    >
    <div class="mt-2 flex items-center gap-x-3">
      <IconAvatar class="h-10 w-10" />
      <button
        :id="id"
        type="button"
        class="rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
      >
        Change
      </button>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'FormAvatar',
  props: {
    id: {
      type: String,
      required: true,
    },
    label: {
      type: String,
      default: 'Avatar',
    },
  },
});
</script>
