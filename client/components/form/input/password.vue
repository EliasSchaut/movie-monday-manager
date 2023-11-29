<template>
  <FormInput
    ref="pw_input_child"
    @input="(e: Event) => $emit('pw_input', (e.target as HTMLInputElement).value)"
    :id="id"
    type="password"
    :label="label != null ? label : $t('common.form.password')"
    placeholder="•••"
    :icon="KeyIcon"
    pattern="^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).*$"
    :minlength="8"
    :maxlength="200"
    :invalid_pattern_feedback="
      pw_confirmed ? invalid_pw_feedback : invalid_pw_confirmed_feedback
    "
    :force_invalid_feedback="!pw_confirmed"
    :side_label="
      show_forgot_password
        ? {
            label: $t('common.form.forgot_password'),
            href: '/login/pw_reset',
          }
        : null
    "
  />
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { KeyIcon } from '@heroicons/vue/20/solid';

export default defineComponent({
  name: 'FormInputPassword',
  data() {
    return {
      invalid_pw_feedback:
        'Das Passwort muss mindestens einen Großbuchstaben, einen Kleinbuchstaben und eine Zahl enthalten.',
      invalid_pw_confirmed_feedback: 'Die Passwörter stimmen nicht überein.',
      pw_pattern: '^(?=.*\\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).*$',
    };
  },
  methods: {
    KeyIcon,
  },
  props: {
    id: {
      type: String,
      required: true,
    },
    label: {
      type: String,
      default: null,
    },
    show_forgot_password: {
      type: Boolean,
      default: false,
    },
    pw_confirmed: {
      type: Boolean,
      default: true,
    },
  },
  emits: {
    pw_input: (pw: string) => true,
  },
});
</script>
