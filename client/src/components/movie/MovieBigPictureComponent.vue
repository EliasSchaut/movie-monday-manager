<template>
  <div v-if="loading" class="spinner-border text-primary m-auto" role="status" />
  <div v-else class="d-flex flex-column">
    <div class="d-flex flex-row justify-content-between">
      <div class="d-flex flex-row align-items-center">
        <b>{{ movie.year }}</b>
        <b class="ms-1 me-1">•</b>

        <img src="../../assets/svg/star-fill.svg" class="align-self-auto me-1 mb-1" alt="imdb_star">
        <b>{{ movie.imdb_rate }}</b>
        <b class="ms-1 me-1">•</b>

        <img width="16" src="../../assets/svg/metacritic.svg" class="me-1" alt="metacritic_logo">
        <b>{{ movie.meta_score }}</b>
        <b class="ms-1 me-1">•</b>

        <img width="16" src="../../assets/svg/rotten_tomatoes.svg" class="me-1" alt="rotten_tomatoes_logo">
        <b class="me-2">{{ movie.meta_score }}%</b>
      </div>
      <b class="right">{{ movie.runtime }} {{ $t("movie.mins") }}</b>
    </div>
    <div>
      <div class="float-start">
        <img class="me-2" v-if="movie.poster !== 'N/A'" style="width: min(50vw, 300px)" :src="movie.poster"
             alt="movie poster">
        <img class="me-2 float-start" v-else src="../../assets/img/Movie_Placeholder.png" alt="movie placeholder">
      </div>

      <p class="mb-1 text-justify">{{ movie.plot }}</p>
      <p class="mb-1 text-justify"><b v-text="$t('movie.genre')"></b>: {{ movie.genre }}</p>
      <p class="mb-1 text-justify"><b v-text="$t('movie.director')"></b>: {{ movie.director }}</p>
      <p class="mb-1 text-justify"><b v-text="$t('movie.actors')"></b>: {{ movie.actors }}</p>
      <p class="mb-1 text-justify"><b v-text="$t('movie.language')"></b>: {{ movie.languages }}</p>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from "vue";
import { call } from "@/util/api";
import type { MovieInfo } from "@prisma/client";

export default defineComponent({
  name: "MovieBigPictureComponent",
  data() {
    return {
      loading: ref(false),
      movie: ref({} as MovieInfo)
    };
  },
  props: {
    imdb_id: {
      type: String,
      required: true
    }
  },
  watch: {
    imdb_id: function(new_value) {
      this.loading = true;
      call("/api/movie/" + new_value)
        .then((data) => {
          this.movie = data;
          this.loading = false;
        });
    }
  }
});
</script>

<style scoped>

</style>