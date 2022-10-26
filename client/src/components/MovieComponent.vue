<template>
<table class="table table-striped table-bordered">
  <thead>
    <tr>
      <th scope="col">Titel</th>
      <th scope="col">Vote</th>
    </tr>
  </thead>
  <tbody>
    <tr v-for="movie in movies" :key="movie.id">
      <td><a :href="movie.link" target="_blank">{{ movie.title }}</a></td>
      <td>
        <button class="btn btn-primary" @click="">
          <i class="fas fa-edit">👍</i>
        </button>
      </td>
    </tr>
  </tbody>
</table>
</template>

<script lang="ts">
import { ref } from "vue";
let movies = ref({ });

export default {
  name: "MovieComponent",
  data() {
    return {
      movies: movies
    };
  },
  setup() {
    console.log("MovieComponent setup");
    fetch("api/movie/all")
      .then((res) => res.json()
        .then(
          (data) => {
            movies.value = data;
          }
        )
      )
  }
};
</script>

<style scoped>
  table {
    width: 70vw;
    margin: 20px auto;
  }
</style>