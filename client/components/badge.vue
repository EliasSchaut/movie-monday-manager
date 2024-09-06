<template>
  <button
    @click="toggle_clicked"
    :class="[
      'text inline-flex select-none items-center gap-x-1.5 rounded-full px-2 py-1 text-xs font-medium transition ease-in-out',
      clickable ? '' : 'pointer-events-none',
      clicked
        ? 'text-secondary-100 bg-secondary-700 hover:bg-secondary-600'
        : 'text-secondary-600 bg-secondary-100',
    ]"
  >
    <slot />
    <XMarkIcon
      class="fill-secondary-400 h-4 w-4"
      v-if="show_close_button && clicked"
    />
  </button>
</template>

<script lang="ts">
import { XMarkIcon } from '@heroicons/vue/16/solid';

export default defineComponent({
  components: {
    XMarkIcon,
  },
  setup() {
    return {
      clicked: ref(false),
    };
  },
  props: {
    clickable: {
      type: Boolean,
      default: false,
    },
    show_close_button: {
      type: Boolean,
      default: false,
    },
    onclick: {
      type: Function,
      default: () => {},
    },
  },
  methods: {
    async toggle_clicked() {
      if (this.clickable) {
        await this.onclick();
        this.clicked = !this.clicked;
      }
    },
  },
});
</script>
