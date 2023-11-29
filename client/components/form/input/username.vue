<template>
  <FormInput
    :id="id"
    type="text"
    label="Username"
    placeholder="max_mustermann"
    :required="true"
    pattern="^[a-z]+(_[a-z]+)*$"
    inside_label="/profile/"
    :minlength="2"
    :maxlength="20"
    invalid_pattern_feedback="Verwende nur englische Kleinbuchstaben und Unterstriche. Der Benutzername muss zudem mit einem Kleinbuchstaben beginnen."
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
  },
});
</script>
