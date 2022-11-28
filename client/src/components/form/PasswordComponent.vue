<template>
  <InputComponent
    v-if="type === 'tripple'"
    :label="label.old"
    type="password"
    placeholder="•••"
    name="password_old"
    pattern="^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$"
    :invalid_feedback="invalid_feedback.single"
    required />

  <InputComponent
    v-if="type === 'double' || type === 'tripple'"
    id="form_input_password"
    :label="label.single"
    type="password"
    placeholder="•••"
    name="password"
    pattern="^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$"
    :invalid_feedback="invalid_feedback.double"
    @input="check_password"
    v-bind="$attrs"
    required />

  <InputComponent
    v-if="type === 'double' || type === 'tripple'"
    id="form_input_password_confirm"
    :label="label.retype"
    type="password"
    placeholder="•••"
    name="password_confirm"
    pattern="^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$"
    :invalid_feedback="invalid_feedback.double_retype"
    @input="check_password"
    required />

  <InputComponent
    v-if="type === 'single'"
    :label="label.single"
    type="password"
    placeholder="•••"
    name="password"
    pattern="^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$"
    :invalid_feedback="invalid_feedback.single"
    v-bind="$attrs"
    required />
</template>

<script lang="ts">
import InputComponent from "@/components/form/InputComponent.vue";

export default {
  name: "PasswordComponent",
  components: { InputComponent },
  inheritAttrs: false,
  data() {
    return {
      label: {
        single: "Password",
        retype: "Retype password",
        old: "Old password"
      },
      invalid_feedback: {
        single: "Minimum eight characters, at least one letter and one number!",
        double: "- At least 8 characters<br>" +
          "- Contains an uppercase letter, lowercase letter, and a number<br>" +
          "- Can contain special characters",
        double_retype: "Should be the same as the password!"
      }
    };
  },
  props: {
    type: {
      type: String,
      default: 'single'
    }
  },
  methods: {
    async check_password() {
      const password = document.getElementById("form_input_password") as HTMLInputElement;
      const password_confirm = document.getElementById("form_input_password_confirm") as HTMLInputElement;
      if (password.value !== password_confirm.value) {
        password_confirm.setCustomValidity("Should be the same as the password!");
      } else {
        password_confirm.setCustomValidity("");
      }
    }
  }
};
</script>

<style scoped>

</style>