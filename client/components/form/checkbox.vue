<template>
  <div class="relative flex items-start">
    <div class="flex h-6 items-center">
      <input
        :id="id"
        :name="id"
        :required="required"
        type="checkbox"
        class="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-600 dark:border-gray-600 dark:bg-white/5 dark:ring-white/10"
      />
    </div>
    <div class="ml-3 text-sm leading-6">
      <label :for="id" class="font-medium text-gray-900 dark:text-white">{{
        label
      }}</label>
      <p class="text-gray-500 dark:text-gray-400">{{ desc }}</p>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'FormCheckbox',
  props: {
    id: {
      type: String,
      required: true,
    },
    label: {
      type: String,
      required: true,
    },
    desc: {
      type: String,
      required: true,
    },
    required: {
      type: Boolean,
      default: false,
    },
  },
});
</script>
