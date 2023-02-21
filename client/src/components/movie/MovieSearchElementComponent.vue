<template>
  <div class="input-group">
    <div class="input-group-text">
      <input class="form-check-input mt-0" type="radio" name="modal_post_movie_radio" @click="$emit('movie_select', movie.imdb_id)">
    </div>
    <div class="form-control d-flex flex-row justify-content-start align-items-center">
      <img v-if="movie.poster !== ''" :src="movie.poster" alt="poster" height="60" class="me-2">
      <img v-else src="../../assets/img/Movie_Placeholder.png" alt="poster_placeholder" height="60" class="me-2">

      <div class="d-flex flex-column justify-content-start">
        <b>{{ movie.title }}</b>
        <i>{{ movie.description }}</i>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import type { MovieSearchType } from "@/types/movie.types/movie_search.type";

export default defineComponent({
  name: "MovieSearchElementComponent",
  props: {
    movie: {
      type: Object as () => MovieSearchType,
      required: true
    }
  }
});
</script>

<style scoped>

</style>