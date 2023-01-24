<template>
    <button class="list-group-item list-group-item-action" type="button">
      <b>{{ title }}</b> {{ year }}
    </button>
</template>

<script lang="ts">
export default {
  name: "MovieSearchElementComponent",
  props: {
    title: {
      type: String,
      required: true
    },
    year: {
      type: String,
      required: true
    }
  }
};
</script>

<style scoped>

</style>