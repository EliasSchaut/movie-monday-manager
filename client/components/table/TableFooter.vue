<script setup lang="ts">
import type { HTMLAttributes } from 'vue';
import cn from '@/utils/cn';

const props = defineProps<{
  class?: HTMLAttributes['class'];
}>();
</script>

<template>
  <tfoot
    :class="
      cn(
        'border-t bg-gray-100/50 font-medium dark:bg-gray-800/50 [&>tr]:last:border-b-0',
        props.class,
      )
    "
  >
    <slot />
  </tfoot>
</template>
