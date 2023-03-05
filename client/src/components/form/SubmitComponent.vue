<template>
  <button v-bind="$attrs" v-if="!loading" type="submit" class="btn btn-primary form-submit"
          data-bs-placement="bottom">
    {{ inner_text ?? $t("common.form.submit") }}
  </button>
  <button v-if="loading" type="submit" class="btn btn-primary form-submit" disabled>
    <span class="spinner-grow spinner-grow-sm" role="status" aria-hidden="true"></span>
    {{ loading_text ?? $t("common.loading") }}
  </button>
</template>

<script lang="ts">
import { store } from "@/util/store";
import { defineComponent } from "vue";

export default defineComponent({
  name: "SubmitComponent",
  data() {
    return {
      loading: store.loading,
      loading_text: "Loading...",
    }
  },
  props: {
    inner_text: {
      type: String,
    },
  },
});
</script>

<style scoped>

</style>