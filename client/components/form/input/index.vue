<template>
  <div>
    <div class="flex items-center justify-between">
      <label
        :for="id"
        class="block text-sm font-medium leading-6 text-gray-900 dark:text-white"
        >{{ label }}</label
      >
      <div v-if="side_label !== null" class="text-sm">
        <NuxtLink
          v-if="side_label.href != null"
          :to="side_label.href"
          class="font-semibold text-indigo-600 hover:text-indigo-500 dark:text-indigo-400 dark:hover:text-indigo-300"
          >{{ side_label.label }}</NuxtLink
        >
        <span v-else class="leading-6 text-gray-500 dark:text-gray-400">
          {{ side_label.label }}
        </span>
      </div>
    </div>
    <div
      :class="[
        inside_label != null
          ? 'flex ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 dark:bg-white/5 dark:ring-white/10 dark:focus:ring-indigo-500'
          : '',
        'relative mt-2 rounded-md shadow-sm',
      ]"
    >
      <div
        v-if="icon != null"
        class="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3"
      >
        <component
          :is="icon()"
          class="h-5 w-5 text-gray-400"
          aria-hidden="true"
        />
      </div>
      <span
        v-if="inside_label != null"
        class="flex select-none items-center pl-3 text-gray-500 dark:text-gray-300 sm:text-sm"
        >{{ inside_label }}</span
      >
      <input
        @input="(e: Event) => { set_invalid_pattern_feedback();$emit('input', e) }"
        :id="id"
        :name="id"
        :type="type"
        :autocomplete="type"
        :minlength="minlength"
        :maxlength="maxlength"
        :required="required"
        :value="value"
        :class="[
          icon != null ? 'pl-10' : '',
          inside_label != null
            ? 'flex-1 bg-transparent pl-1 focus:ring-0'
            : 'w-full ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 dark:bg-white/5 dark:ring-white/10 dark:focus:ring-indigo-500',
          'block rounded-md border-0 py-1.5 text-gray-900 placeholder:text-gray-400 dark:text-white sm:text-sm sm:leading-6',
        ]"
        :placeholder="placeholder != null ? placeholder : ''"
        :pattern="pattern != null ? pattern : ''"
      />
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue';
import { EnvelopeIcon } from '@heroicons/vue/20/solid';

export default defineComponent({
  name: 'FormInput',
  components: { EnvelopeIcon },
  methods: {
    set_invalid_pattern_feedback() {
      const input = document.getElementById(this.id) as HTMLInputElement;
      if (this.force_invalid_feedback || input.validity.patternMismatch) {
        input.setCustomValidity(this.invalid_pattern_feedback);
      } else input.setCustomValidity('');
    },
  },
  created() {
    watch(
      () => this.force_invalid_feedback,
      () => this.set_invalid_pattern_feedback(),
    );
  },
  props: {
    id: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      required: true,
    },
    label: {
      type: String,
      required: true,
    },
    placeholder: {
      type: String,
      default: null,
    },
    icon: {
      type: Function,
      default: null,
    },
    required: {
      type: Boolean,
      default: false,
    },
    side_label: {
      type: Object as PropType<{ label: string; href: string | null }>,
      default: null,
    },
    inside_label: {
      type: String,
      default: null,
    },
    pattern: {
      type: String,
      default: '.*',
    },
    invalid_pattern_feedback: {
      type: String,
      default: null,
    },
    minlength: {
      type: Number,
      default: 0,
    },
    maxlength: {
      type: Number,
      default: 10000,
    },
    force_invalid_feedback: {
      type: Boolean,
      default: false,
    },
    value: {
      type: String,
      default: '',
    },
  },
  emits: {
    input: (e: Event) => true,
  },
});
</script>
