<template>
  <button v-bind="$attrs" v-if="!loading" type="submit" class="btn btn-primary form-submit"
          data-bs-placement="bottom">
    {{ inner_text }}
  </button>
  <button v-if="loading" type="submit" class="btn btn-primary form-submit" disabled>
    <span class="spinner-grow spinner-grow-sm" role="status" aria-hidden="true"></span>
    {{ loading_text }}
  </button>
</template>

<script lang="ts">
import { store } from "@/util/store";

export default {
  name: "SubmitComponent",
  data() {
    return {
      loading: store.loading,
      loading_text: "Loading..."
    }
  },
  props: {
    inner_text: {
      type: String,
      default: "Submit"
    },
  },
};
</script>

<style scoped>

</style>