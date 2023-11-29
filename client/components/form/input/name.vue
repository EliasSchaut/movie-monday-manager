<template>
  <FormInput
    :id="id"
    type="text"
    :label="label"
    :placeholder="placeholder"
    :required="required"
    pattern="^[A-ZÖÄÜ][A-Za-zÖÄÜöäüß ]*$"
    :minlength="2"
    :maxlength="20"
    invalid_pattern_feedback="Der Name muss mit einem Großbuchstaben beginnen und muss ein gültiger Name sein."
  />
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'FormInputEmail',
  props: {
    id: {
      type: String,
      required: true,
    },
    label: {
      type: String,
      default: 'Name',
    },
    placeholder: {
      type: String,
      default: 'John',
    },
    required: {
      type: Boolean,
      default: false,
    },
  },
});
</script>
