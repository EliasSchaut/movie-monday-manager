<template>
  <InputComponent
    :label="$t('common.form.name.label')"
    type="text"
    placeholder="Max Mustermann"
    name="name"
    pattern="^[A-Z].{2,20}$"
    :invalid_feedback="$t('common.form.name.invalid_feedback')"
    required />
</template>

<script lang="ts">
import InputComponent from "@/components/form/InputComponent.vue";
import { defineComponent } from "vue";
export default defineComponent({
  name: "NameComponent",
  components: { InputComponent }
});
</script>

<style scoped>

</style>