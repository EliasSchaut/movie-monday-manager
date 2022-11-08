<template>
<div class="main table-responsive">
  <table class="table table-striped table-bordered table-active">
    <thead>
      <tr class="table-dark align-middle">
        <th scope="col" class="d-flex justify-content-between align-items-baseline" style="min-width: 100px">
          <div>Title</div>
          <button class="btn btn-success" data-bs-toggle="modal" data-bs-target="#modal_add_movie" :disabled="!store.logged_in">
            <b>+</b>
          </button>
        </th>
        <th scope="col">Year</th>
        <th scope="col">Genre</th>
        <th scope="col">Proposer</th>
        <th scope="col" style="min-width: 120px">Proposed on</th>
        <th scope="col" colspan="2">Interested</th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="movie in movies" :key="movie.imdb_id" :id="movie.imdb_id">
        <td><a :href="movie.link" target="_blank">{{ movie.title }}</a></td>
        <td><p>{{ movie.year }}</p></td>
        <td><p>{{ movie.genre }}</p></td>
        <td><p>{{ movie.proposer }}</p></td>
        <td><p>{{ (new Date(movie.createdAt)).toLocaleDateString() }}</p></td>
        <td><p>{{ movie.votes }}</p></td>
        <td>
          <button v-if="store.logged_in && movie.proposer_id === user_id" :id="'v_' + movie.imdb_id" class="btn btn-danger" @click="delete_media(movie.imdb_id)" :disabled="!store.logged_in">
            <i class="fas fa-edit">X</i>
          </button>
          <button v-else-if="votes.includes(movie.imdb_id)" :id="'v_' + movie.imdb_id" class="btn btn-primary" @click="unvote(movie.imdb_id)" :disabled="!store.logged_in">
            <i class="fas fa-edit">👍</i>
          </button>
          <button v-else :id="'v_' + movie.imdb_id" class="btn btn-outline-primary" @click="vote(movie.imdb_id)" :disabled="!store.logged_in">
            <i class="fas fa-edit">👍</i>
          </button>
        </td>
      </tr>
    </tbody>
  </table>
</div>

  <div class="modal fade" id="modal_add_movie" tabindex="-1">
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title">Add Movie</h5>
          <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
        </div>
        <form action="api/movie/" method="post" @submit.prevent="onSubmit" id="form_register" class="form needs-validation">
          <div class="modal-body">
            <b>IMDB ID:</b>
            <input type="text" class="form-control" id="from_imdb_id" placeholder="tt1234567" name="imdb_id" required>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
            <button type="submit" class="btn btn-primary">Submit</button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { store } from './util/store.js'
import { ref } from "vue";
let movies = ref([] as any[]);
let votes = ref([] as any[]);
let user_id = ref(-1);

fetch("api/movie/all")
  .then((res) => res.json()
    .then(
      (data) => {
        movies.value = data;
        console.log(movies.value);
      }
    )
  )

if (store.logged_in) {
  fetch("api/vote", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      "Authorization": "Bearer " + localStorage.getItem("access_token")
    }
  })
    .then((res) => res.json()
      .then(
        (data) => {
          votes.value = data;
          console.log(data);
        }
      )
    )
  fetch("api/profile", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      "Authorization": "Bearer " + localStorage.getItem("access_token")
    }
  })
    .then((res) => res.json()
      .then(
        (data) => {
          user_id.value = data.id;
        }
      )
    )
}
</script>

<script lang="ts">
import router from "@/router";

export default {
  name: "MovieComponent",
  methods: {
    onSubmit(e: Event) {
      const form_html = e.target as HTMLFormElement;
      const form = new FormData(form_html);
      const imdb_id = form.get("imdb_id") as string

      fetch(form_html.action + imdb_id, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": "Bearer " + localStorage.getItem("access_token")
        }
      })
        .then((res) => res.json())
        .then((data) => {
          console.log(data);
          this.vote(imdb_id);
        });
    },
    vote(imdb_id: string) {
      fetch("api/vote/" + imdb_id, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": "Bearer " + localStorage.getItem("access_token")
        }
      })
        .then((res) => res.json())
        .then((data) => {
          console.log(data);
          router.go(0);
        });
    },
    unvote(imdb_id: string) {
      fetch("api/vote/" + imdb_id, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          "Authorization": "Bearer " + localStorage.getItem("access_token")
        }
      })
        .then((res) => res.json())
        .then((data) => {
          console.log(data);
          router.go(0);
        });
    },
    delete_media(imdb_id: string) {
      fetch("api/movie/" + imdb_id, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          "Authorization": "Bearer " + localStorage.getItem("access_token")
        }
      })
        .then((res) => res.json())
        .then((data) => {
          console.log(data);
          router.go(0);
        });
    }
  }
};
</script>

<style scoped>
  .main {
    width: 90vw;
    margin: 20px auto;
  }
</style>