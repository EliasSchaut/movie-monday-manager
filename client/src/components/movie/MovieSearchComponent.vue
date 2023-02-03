<template>
  <div v-if="movies.length !== 0" class="list-group">
    <MovieSearchElementComponent v-for="movie in movies" :title="movie.title" :year="movie.year" @click="save_movie(movie.imdb_id)" />
  </div>
  <div v-else class="list-group">
    <button type="button" class="list-group-item list-group-item-action" disabled>{{ $t("movie.modal.no_suggestion") }}</button>
  </div>
</template>

<script lang="ts">
import MovieSearchElementComponent from "@/components/movie/MovieSearchElementComponent.vue";

export default {
  name: "MovieSearchComponent",
  components: { MovieSearchElementComponent },
  props: {
    movies: {
      type: Array,
      default: []
    }
  },
  methods: {
    save_movie(imdb_id: string) {
      const input = document.getElementById("from_imdb_id") as HTMLInputElement
      input.value = imdb_id
    }
  }
};
</script>

<style scoped>

</style>