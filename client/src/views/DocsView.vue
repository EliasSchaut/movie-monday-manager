<template>
<CardComponent header="Docs" id="card_docs" nobody>
  <ul class="list-group list-group-flush">
    <li class="list-group-item">
      <a href="/docs/api" target="_blank">Api Docs</a>
    </li>
    <li class="list-group-item">
      <a href="/docs/backend" target="_blank">Backend Docs</a>
    </li>
  </ul>
</CardComponent>
</template>

<script lang="ts">
import CardComponent from "@/components/CardComponent.vue";

export default {
  name: "DocsView",
  components: { CardComponent }
};
</script>

<style scoped>
#card_docs {
  width: min(500px, 90vw);
  margin: 20px auto
}
</style>