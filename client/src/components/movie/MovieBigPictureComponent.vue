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
        <b class="me-2">{{ movie.metascore }}</b>
      </div>
      <b class="right">{{ movie.runtime }} {{ $t('movie.mins') }}</b>
    </div>
    <div class="d-flex flex-row">
      <div class="d-flex flex-column me-2">
        <img v-if="movie.poster !== 'N/A'" style="width: min(50vw, 300px)" :src="movie.poster" alt="movie poster">
        <img v-else src="../../assets/img/Movie_Placeholder.png" alt="movie placeholder">
      </div>
      <div class="d-flex flex-column mt-1">
        <div class="mb-1">{{ movie.plot }}</div>
        <div class="mb-1"><b v-text="$t('movie.genre')"></b>: {{ movie.genre }} </div>
        <div class="mb-1"><b v-text="$t('movie.director')"></b>: {{ movie.director }}</div>
        <div class="mb-1"><b v-text="$t('movie.language')"></b>: {{ movie.language }}</div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from "vue";
import { call } from "@/util/api";

export default defineComponent({
  name: "MovieBigPictureComponent",
  data() {
    return {
      loading: ref(false),
      movie: ref({} as any)
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
          console.log(data)
        });
    }
  }
});
</script>

<style scoped>

</style>