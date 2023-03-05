<template>
  <div v-if="movies.length !== 0" class="mt-2">
    <MovieSearchElementComponent v-for="movie in movies" :movie="movie"
                                 @movie_select="(imdb_id: string) => $emit('movie_select', imdb_id)" />
  </div>
  <div v-else class="list-group mt-2">
    <button type="button" class="list-group-item list-group-item-action" disabled>{{ $t("movie.modal.form.no_suggestion") }}</button>
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
  }
});
</script>

<style scoped>

</style>