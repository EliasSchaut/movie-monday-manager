<template>
  <InputComponent
    :label="label"
    type="text"
    placeholder="Max Mustermann"
    name="name"
    pattern="^[A-Z](.*)"
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
      invalid_feedback: "Should start with a capital letter.",
    }
  },
};
</script>

<style scoped>

</style>