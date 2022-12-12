<template>
  <InputComponent
    :label="label"
    type="text"
    placeholder="Max Mustermann"
    name="name"
    pattern="^[A-Z].{2,20}$"
    :invalid_feedback="invalid_feedback"
    required />
</template>

<script lang="ts">
import InputComponent from "@/components/form/InputComponent.vue";
export default {
  name: "NameComponent",
  components: { InputComponent },
  data() {
    return {
      label: "Name",
      invalid_feedback: "Must be between 3 and 20 characters and start with a capital letter!",
    }
  },
};
</script>

<style scoped>

</style>