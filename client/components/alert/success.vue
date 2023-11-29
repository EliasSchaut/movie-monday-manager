<template>
  <div
    class="bg-green-50 p-4 ring-2 ring-green-100 dark:bg-green-950 dark:ring-green-900 sm:relative sm:top-3 sm:m-auto sm:w-2/3 sm:rounded-md"
  >
    <div class="flex">
      <div class="flex-shrink-0">
        <CheckCircleIcon
          class="h-5 w-5 text-green-400 dark:text-green-500"
          aria-hidden="true"
        />
      </div>
      <div class="ml-3">
        <p class="text-sm font-medium text-green-800 dark:text-green-200">
          {{ alert.msg }}
        </p>
      </div>
      <div class="ml-auto pl-3">
        <div class="-mx-1.5 -my-1.5">
          <button
            @click="alert.hide()"
            type="button"
            class="inline-flex rounded-md bg-green-50 p-1.5 text-green-500 hover:bg-green-100 focus:outline-none focus:ring-2 focus:ring-green-600 focus:ring-offset-2 focus:ring-offset-green-50 dark:bg-green-950 dark:text-green-400 dark:hover:bg-green-900 dark:focus:ring-green-500 dark:focus:ring-offset-green-950"
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
import { CheckCircleIcon, XMarkIcon } from '@heroicons/vue/20/solid';
import { alertStore } from '~/store/alert';
const alert = alertStore();
</script>
