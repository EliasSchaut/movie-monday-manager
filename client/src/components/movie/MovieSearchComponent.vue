<template>
  <div v-if="movies.length !== 0" class="list-group">
    <MovieSearchElementComponent v-for="movie in movies" :title="movie.description" @click="save_movie(movie.imdb_id)" />
  </div>
  <div v-else class="list-group">
    <button type="button" class="list-group-item list-group-item-action" disabled>{{ $t("movie.modal.no_suggestion") }}</button>
  </div>
</template>

<script lang="ts">
import MovieSearchElementComponent from "@/components/movie/MovieSearchElementComponent.vue";
import { defineComponent } from "vue";
import type { MovieSearchType } from "@/types/movie.types/movie_search.type";

export default defineComponent({
  name: "MovieSearchComponent",
  components: { MovieSearchElementComponent },
  props: {
    movies: {
      type: Array as () => MovieSearchType[],
      default: []
    }
  },
  methods: {
    save_movie(imdb_id: string) {
      const input = document.getElementById("from_imdb_id") as HTMLInputElement
      input.value = imdb_id
    }
  }
});
</script>

<style scoped>

</style>