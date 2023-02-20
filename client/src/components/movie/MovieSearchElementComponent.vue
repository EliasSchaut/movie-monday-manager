<template>
    <button class="list-group-item list-group-item-action" type="button">
      <b>{{ title }}</b>
    </button>
</template>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  name: "MovieSearchElementComponent",
  props: {
    title: {
      type: String,
      required: true
    }
  }
});
</script>

<style scoped>

</style>