<template>
  <InputComponent
    :label="label"
    type="email"
    placeholder="max@mustermann.de"
    name="username"
    :invalid_feedback="invalid_feedback"
    required />
</template>

<script lang="ts">
import InputComponent from "@/components/form/InputComponent.vue";
export default {
  name: "EmailComponent",
  components: { InputComponent },
  data() {
    return {
      label: "Email",
      invalid_feedback: "Please enter a valid email address!",
    }
  },
};
</script>

<style scoped>

</style>