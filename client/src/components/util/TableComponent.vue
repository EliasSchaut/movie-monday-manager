<template>
  <table class="table table-striped table-bordered table-active">
    <thead>
      <tr class="table-dark align-middle">
        <th v-for="column in head" :data-field="column" data-sortable="true">{{ column }}</th>
      </tr>
    </thead>
    <tbody>
      <slot />
    </tbody>
  </table>
</template>

<script lang="ts">

export default {
  name: "TableComponent",
  props: {
    head: {
      type: Array,
      required: true
    },
  }
};
</script>

<style scoped>

</style>