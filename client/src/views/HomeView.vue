<template>
  <WatchlistComponent />
  <div class="main table-responsive">
    <table class="table table-striped table-bordered table-active" >
      <thead>
      <tr class="table-dark align-middle">
        <th data-field="title" data-sortable="true" scope="col" class="d-flex justify-content-between align-items-baseline" style="min-width: 100px">
          <div>Title</div>
          <button class="btn btn-success" data-bs-toggle="modal" data-bs-target="#modal_add_movie" :disabled="!store.logged_in"><b>+</b></button>
        </th>
        <th data-field="year" data-sortable="true" scope="col">Year</th>
        <th data-field="gerne" data-sortable="true" scope="col">Genre</th>
        <th data-field="proposer" data-sortable="true" scope="col">Proposer</th>
        <th data-field="proposed_on" data-sortable="true" scope="col">Proposed&nbsp;on</th>
        <th data-field="interested" data-sortable="true" scope="col" colspan="2">Interested</th>
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
            <img class="fas fa-edit" src="../assets/svg/trash-fill.svg" alt="trash">
          </button>
          <button v-else-if="votes.includes(movie.imdb_id)" :id="'v_' + movie.imdb_id" class="btn btn-primary" @click="unvote(movie.imdb_id)" :disabled="!store.logged_in">
            <img class="fas fa-edit" src="../assets/svg/heart-fill.svg" alt="heart">
          </button>
          <button v-else :id="'v_' + movie.imdb_id" class="btn btn-outline-primary" @click="vote(movie.imdb_id)" :disabled="!store.logged_in">
            <img class="fas fa-edit" src="../assets/svg/heartbreak-fill.svg" alt="heartbreak">
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
        <form action="api/movie/" method="post" @submit.prevent="add_media" id="form_register" class="form was-validated" novalidate>
          <div class="modal-body">
            <b>IMDB ID:</b>
            <input type="text" class="form-control" id="from_imdb_id" placeholder="tt1234567" name="imdb_id" pattern="^tt[0-9]+$" required>
            <div class="valid-feedback">
              Looks good!
            </div>
            <div class="invalid-feedback">
              Should be a valid IMDB ID, e.g. tt1234567
            </div>
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

<script lang="ts">
import { ref } from "vue";
import { store } from '@/util/store'
import { call } from "@/util/api";
import router from "@/router/router";
import WatchlistComponent from "@/components/WatchlistComponent.vue";

export default {
  name: "MovieComponent",
  data() {
    return { store }
  },
  components: { WatchlistComponent },
  setup() {
    let movies = ref([] as any[]);
    let votes = ref([] as any[]);
    let user_id = ref(-1);

    call("api/movie/all")
      .then((data) => { movies.value = data; })

    if (store.logged_in) {
      call("api/vote")
        .then((data) => { votes.value = data; })
      call("api/user")
        .then((data) => { user_id.value = data.id; })
    }

    return {
      movies,
      votes,
      user_id
    }
  },
  methods: {
    add_media(e: Event) {
      const form_html = e.target as HTMLFormElement;
      if (!form_html.checkValidity()) {
        return
      }

      const form = new FormData(form_html);
      const imdb_id = form.get("imdb_id") as string

      call(form_html.action + imdb_id, "POST")
        .then((data) => {
          if (data.hasOwnProperty("statusCode")) {
            form_html.setAttribute("data-bs-dismiss", "modal");
            form_html.click()
            form_html.removeAttribute("data-bs-dismiss");
          } else {
            router.go(0)
          }
        })
    },
    delete_media(imdb_id: string) {
      call("api/movie/" + imdb_id, "DELETE")
        .then((data) => {
          if (!data.hasOwnProperty("statusCode")) {
            router.go(0)
          }
        })
    },
    vote(imdb_id: string) {
      call("api/vote/" + imdb_id, "POST")
        .then(() => router.go(0))
    },
    unvote(imdb_id: string) {
      call("api/vote/" + imdb_id, "DELETE")
        .then(() => router.go(0))
    }
  },
};
</script>

<style scoped>
.main {
  width: 90vw;
  margin: 20px auto;
}
</style>
