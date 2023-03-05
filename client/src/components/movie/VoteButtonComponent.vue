<template>
  <button v-if="type === 'delete'" class="btn btn-danger" v-bind="$attrs">
    <img class="fas fa-edit" src="../../assets/svg/trash-fill.svg" alt="trash">
  </button>
  <button v-else-if="type === 'voted'" class="btn btn-primary" v-bind="$attrs">
    <img class="fas fa-edit" src="../../assets/svg/heart-fill.svg" alt="heart">
  </button>
  <button v-else v-bind="$attrs" class="btn btn-outline-primary">
    <img v-if="store.theme_without_auto === 'dark'" class="fas fa-edit" src="../../assets/svg/heartbreak-fill-white.svg" alt="heartbreak">
    <img v-else class="fas fa-edit" src="../../assets/svg/heartbreak-fill.svg" alt="heartbreak">
  </button>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { store } from "@/util/store";

export default defineComponent({
  name: "VoteButtonComponent",
  data() {
    return {
      store: store
    };
  },
  inheritAttrs: false,
  props: {
    type: {
      type: String,
      required: true
    },
  }
});
</script>

<style scoped>

</style>