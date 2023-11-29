<template>
  <FormInput
    :id="id"
    type="email"
    :label="$t('common.form.mail')"
    placeholder="you@example.com"
    :required="required"
    :icon="EnvelopeIcon"
  />
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { EnvelopeIcon } from '@heroicons/vue/20/solid';

export default defineComponent({
  name: 'FormInputEmail',
  methods: { EnvelopeIcon },
  props: {
    id: {
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
