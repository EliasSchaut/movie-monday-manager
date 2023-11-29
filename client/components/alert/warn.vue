success.vue
<template>
  <div
    class="bg-yellow-50 p-4 ring-2 ring-yellow-100 dark:bg-yellow-950 dark:ring-yellow-900 sm:relative sm:top-3 sm:m-auto sm:w-2/3 sm:rounded-md"
  >
    <div class="flex">
      <div class="flex-shrink-0">
        <ExclamationTriangleIcon
          class="h-5 w-5 text-yellow-400 dark:text-yellow-300"
          aria-hidden="true"
        />
      </div>
      <div class="ml-3">
        <p class="text-sm font-medium text-yellow-800 dark:text-yellow-200">
          {{ alert.msg }}
        </p>
      </div>
      <div class="ml-auto pl-3">
        <div class="-mx-1.5 -my-1.5">
          <button
            @click="alert.hide()"
            type="button"
            class="inline-flex rounded-md bg-yellow-50 p-1.5 text-yellow-500 hover:bg-yellow-100 focus:outline-none focus:ring-2 focus:ring-yellow-600 focus:ring-offset-2 focus:ring-offset-yellow-50 dark:bg-yellow-950 dark:text-yellow-400 dark:hover:bg-yellow-900 dark:focus:ring-yellow-400 dark:focus:ring-offset-yellow-950"
          >
            <span class="sr-only">{{ $t('common.sr.dismiss') }}</span>
            <XMarkIcon class="h-5 w-5" aria-hidden="true" />
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ExclamationTriangleIcon, XMarkIcon } from '@heroicons/vue/20/solid';
import { alertStore } from '~/store/alert';
const alert = alertStore();
</script>
