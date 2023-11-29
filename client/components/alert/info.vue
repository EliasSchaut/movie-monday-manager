<template>
  <div
    class="bg-blue-50 p-4 ring-2 ring-blue-100 dark:bg-blue-950 dark:ring-blue-900 sm:relative sm:top-3 sm:m-auto sm:w-2/3 sm:rounded-md"
  >
    <div class="flex">
      <div class="flex-shrink-0">
        <InformationCircleIcon
          class="h-5 w-5 text-blue-400 dark:text-blue-300"
          aria-hidden="true"
        />
      </div>
      <div class="ml-3">
        <p class="text-sm font-medium text-blue-800 dark:text-blue-200">
          {{ alert.msg }}
        </p>
      </div>
      <div class="ml-auto pl-3">
        <div class="-mx-1.5 -my-1.5">
          <button
            @click="alert.hide()"
            type="button"
            class="inline-flex rounded-md bg-blue-50 p-1.5 text-blue-500 hover:bg-blue-100 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2 focus:ring-offset-blue-50 dark:bg-blue-950 dark:text-blue-400 dark:hover:bg-blue-900 dark:focus:ring-blue-400 dark:focus:ring-offset-blue-950"
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
import { InformationCircleIcon, XMarkIcon } from '@heroicons/vue/20/solid';
import { alertStore } from '~/store/alert';
const alert = alertStore();
</script>
