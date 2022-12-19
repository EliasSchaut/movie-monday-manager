<template>
  <InputComponent
    :label="$t('common.form.username.label')"
    type="email"
    placeholder="max@mustermann.de"
    name="username"
    :invalid_feedback="$t('common.form.username.invalid_feedback')"
    required />
</template>

<script lang="ts">
import InputComponent from "@/components/form/InputComponent.vue";
export default {
  name: "EmailComponent",
  components: { InputComponent },
};
</script>

<style scoped>

</style>