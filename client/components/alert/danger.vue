<template>
  <div
    class="bg-red-50 p-4 ring-2 ring-red-100 dark:bg-red-950 dark:ring-red-900 sm:relative sm:top-3 sm:m-auto sm:w-2/3 sm:rounded-md"
  >
    <div class="flex">
      <div class="flex-shrink-0">
        <XCircleIcon
          class="h-5 w-5 text-red-400 dark:text-red-300"
          aria-hidden="true"
        />
      </div>
      <div class="ml-3">
        <p class="text-sm font-medium text-red-800 dark:text-red-200">
          {{ alert.msg }}
        </p>
      </div>
      <div class="ml-auto pl-3">
        <div class="-mx-1.5 -my-1.5">
          <button
            @click="alert.hide()"
            type="button"
            class="inline-flex rounded-md bg-red-50 p-1.5 text-red-500 hover:bg-red-100 focus:outline-none focus:ring-2 focus:ring-red-600 focus:ring-offset-2 focus:ring-offset-red-50 dark:bg-red-950 dark:text-red-400 dark:hover:bg-red-900 dark:focus:ring-red-400 dark:focus:ring-offset-red-950"
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
import { XCircleIcon, XMarkIcon } from '@heroicons/vue/20/solid';
import { alertStore } from '~/store/alert';
const alert = alertStore();
</script>
