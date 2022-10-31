<template>
<div class="main">
  <table class="table table-striped table-bordered table-active"
         data-toolbar="#toolbar"
         data-search="true"
         data-show-refresh="true"
         data-show-toggle="true"
         data-show-fullscreen="true"
         data-show-columns="true"
         data-show-columns-toggle-all="true"
         data-detail-view="true"
         data-show-export="true"
         data-click-to-select="true"
         data-detail-formatter="detailFormatter"
         data-minimum-count-columns="2"
         data-show-pagination-switch="true"
         data-pagination="true"
         data-id-field="id"
         data-page-list="[10, 25, 50, 100, all]"
         data-show-footer="true"
         data-side-pagination="server"
         data-url="https://examples.wenzhixin.net.cn/examples/bootstrap_table/data"
         data-response-handler="responseHandler">
    <thead>
      <tr class="table-dark align-middle">
        <th scope="col" class="d-flex justify-content-between align-items-baseline">
          Title
          <button class="btn btn-success" data-bs-toggle="modal" data-bs-target="#modal_add_movie"><b>+</b></button>
        </th>
        <th scope="col">Proposer</th>
        <th scope="col">Vote</th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="movie in movies" :key="movie.imdb_id" :id="movie.imdb_id">
        <td><a :href="movie.link" target="_blank">{{ movie.title }}</a></td>
        <td><p>{{ movie.proposer }}</p></td>
        <td>
          <button class="btn btn-primary" @click="">
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

<script lang="ts">
import { ref } from "vue";
let movies = ref({ });

export default {
  name: "MovieComponent",
  data() {
    return {
      movies
    };
  },
  setup(props: any) {
    fetch("api/movie/all")
      .then((res) => res.json()
        .then(
          (data) => {
            movies.value = data;
            console.log(movies.value);

          }
        )
      )
    console.log(props.logged_in);
  },
  methods: {
    onSubmit(e: SubmitEvent) {
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
        });
    }
  }
};
</script>

<style scoped>
  .main {
    width: 70vw;
    margin: 20px auto;
  }
</style>