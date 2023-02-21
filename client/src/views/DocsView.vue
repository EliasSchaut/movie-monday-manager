<template>
<CardComponent :header="$t('docs.title')" id="card_docs" nobody>
  <ul class="list-group list-group-flush">
    <li class="list-group-item">
      <a href="/docs/api" target="_blank">{{ $t('docs.api') }}</a>
    </li>
    <li class="list-group-item">
      <a href="/docs/backend" target="_blank">{{ $t('docs.backend') }}</a>
    </li>
  </ul>
</CardComponent>
</template>

<script lang="ts">
import CardComponent from "@/components/CardComponent.vue";
import { defineComponent } from "vue";

export default defineComponent({
  name: "DocsView",
  components: { CardComponent }
});
</script>

<style scoped>
#card_docs {
  width: min(500px, 90vw);
  margin: 20px auto
}
</style>