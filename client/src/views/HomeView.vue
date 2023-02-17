<template>
  <WatchlistComponent />

  <div class="main">
    <button class="position-absolute btn btn-success mb-2" data-bs-toggle="modal" data-bs-target="#modal_add_movie"
            :disabled="!store.logged_in"><b>{{ $t("movie.modal.title") }} +</b></button>
    <TableComponent
      :head="['' , $t('movie.title'), $t('movie.year'), $t('movie.genre'), $t('movie.director'), $t('movie.actors'), $t('movie.imdb_rate'), $t('movie.metascore'), $t('movie.language'), $t('movie.proposer'), $t('movie.proposed_on'), $t('movie.interested')]"
      id="table_movie" sortable :sort_default="[11, 'desc']" filterable :filter_default="[true, true, true, true, false, false, true, false, false, true, false, true]">
      <tr v-for="movie in movies" :key="movie.imdb_id" :id="movie.imdb_id">
        <td :title="movie.title">
          <button type="button" class="btn btn-secondary" data-bs-toggle="modal" data-bs-target="#modal_big_picture"
                  @click="big_picture_imdb_id = movie.imdb_id;big_picture_title = movie.title">
            <img src="../assets/svg/box-arrow-up-right.svg" alt="big_picture">
          </button>
        </td>
        <td :title="movie.title"><a :href="movie.link" target="_blank">{{ movie.title }}</a></td>
        <td :title="movie.year">{{ movie.year }}</td>
        <td :title="movie.genre">{{ movie.genre }}</td>
        <td :title="movie.director">{{ movie.director }}</td>
        <td :title="movie.actors">{{ movie.actors }}</td>
        <td :title="movie.imdb_rate">{{ movie.imdb_rate }}</td>
        <td :title="movie.metascore">{{ movie.metascore }}</td>
        <td :title="movie.language">{{ movie.language }}</td>
        <td :title="movie.proposer">{{ movie.proposer }}</td>
        <td :title="movie.createdAt">{{ (new Date(movie.createdAt)).toLocaleDateString() }}</td>
        <td :title="movie.votes" :id="'table_movie_votes_td_' + movie.imdb_id">
          <div class="d-flex justify-content-between flex-row">
            <div :id="'table_movie_votes_' + movie.imdb_id" style="align-self: center">{{ movie.votes }}</div>
            <div>
              <button v-if="store.logged_in && movie.proposer_id === user_id" :id="'v_' + movie.imdb_id"
                      class="btn btn-danger" @click="delete_media(movie.imdb_id)" :disabled="!store.logged_in">
                <img class="fas fa-edit" src="../assets/svg/trash-fill.svg" alt="trash">
              </button>
              <button v-else-if="votes.includes(movie.imdb_id)" :id="'v_' + movie.imdb_id" class="btn btn-primary"
                      @click="unvote(movie.imdb_id, votes)" :disabled="!store.logged_in">
                <img class="fas fa-edit" src="../assets/svg/heart-fill.svg" alt="heart">
              </button>
              <button v-else :id="'v_' + movie.imdb_id" class="btn btn-outline-primary"
                      @click="vote(movie.imdb_id, votes)" :disabled="!store.logged_in">
                <img v-if="store.theme_without_auto === 'dark'" class="fas fa-edit" src="../assets/svg/heartbreak-fill-white.svg" alt="heartbreak">
                <img v-else class="fas fa-edit" src="../assets/svg/heartbreak-fill.svg" alt="heartbreak">
              </button>
            </div>
          </div>
        </td>
      </tr>
    </TableComponent>
  </div>

  <ModalComponent id="modal_add_movie" :title="$t('movie.modal.title')" spawn_over_body>
    <form action="api/movie/" method="post" @submit.prevent="add_media" id="form_post_movie" class="form was-validated"
          novalidate>
      <div class="modal-body">
        <b>{{ $t("movie.modal.form.title") }}</b>
        <input type="text" class="form-control" id="from_imdb_id" placeholder="tt1234567" name="imdb_id"
               pattern="^tt[0-9]{1,12}$" @input="search_media" required>
        <div class="valid-feedback">
          Looks good!
        </div>
        <div class="invalid-feedback">
          {{ $t("movie.modal.form.invalid_feedback") }}
        </div>

        <MovieSearchComponent :movies="search_movies" />
      </div>
      <div class="modal-footer">
        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">{{ $t("common.modal.close") }}</button>
        <button type="submit" class="btn btn-primary">{{ $t("common.form.submit") }}</button>
      </div>
    </form>
  </ModalComponent>

  <ModalComponent id="modal_big_picture" class="modal-lg" :title="big_picture_title">
    <MovieBigPictureComponent :imdb_id="big_picture_imdb_id" />
  </ModalComponent>
</template>

<script lang="ts">
import { ref, defineComponent } from "vue";
import { store } from "@/util/store";
import { call } from "@/util/api";
import router from "@/router/router";
import WatchlistComponent from "@/components/WatchlistComponent.vue";
import ModalComponent from "@/components/ModalComponent.vue";
import FormComponent from "@/components/form/FormComponent.vue";
import TableComponent from "@/components/TableComponent.vue";
import MovieSearchElementComponent from "@/components/movie/MovieSearchElementComponent.vue";
import MovieSearchComponent from "@/components/movie/MovieSearchComponent.vue";
import MovieBigPictureComponent from "@/components/movie/MovieBigPictureComponent.vue";

const search_movies = ref([] as any[]);

export default defineComponent({
  name: "HomeView",
  data() {
    return {
      store,
      search_movies,
      big_picture_imdb_id: ref(""),
      big_picture_title: ref("")
    };
  },
  components: {
    MovieBigPictureComponent,
    TableComponent,
    FormComponent,
    MovieSearchComponent,
    MovieSearchElementComponent,
    WatchlistComponent,
    ModalComponent
  },
  setup() {
    let movies = ref([] as any[]);
    let votes = ref([] as any[]);
    let user_id = ref(-1);

    call("api/movie/all")
      .then((data) => {
        movies.value = data;
      });

    if (store.logged_in) {
      call("api/vote")
        .then((data) => {
          votes.value = data;
        });
      call("api/user")
        .then((data) => {
          user_id.value = data.id;
        });
    }

    return {
      movies,
      votes,
      user_id
    };
  },
  methods: {
    search_media(e: Event) {
      const search_input = (e.target as HTMLInputElement).value;
      if (search_input.length < 3) return;
      if (/^tt[0-9]+$/.test(search_input)) return;

      call("api/movie/search", "POST", { search_input })
        .then((data) => {
          search_movies.value = data;
        });
    },
    add_media(e: Event) {
      const form_html = e.target as HTMLFormElement;
      if (!form_html.checkValidity()) {
        return;
      }

      const form = new FormData(form_html);
      const imdb_id = form.get("imdb_id") as string;

      call(form_html.action + imdb_id, "POST")
        .then((data) => {
          if (data.hasOwnProperty("statusCode")) {
            form_html.setAttribute("data-bs-dismiss", "modal");
            form_html.click();
            form_html.removeAttribute("data-bs-dismiss");
          } else {
            router.go(0);
          }
        });
    },
    delete_media(imdb_id: string) {
      call("api/movie/" + imdb_id, "DELETE")
        .then((data) => {
          if (!data.hasOwnProperty("statusCode")) {
            const table = document.getElementById("table_movie") as HTMLTableElement;
            const tr = document.getElementById(imdb_id) as HTMLTableRowElement;
            table.deleteRow(tr.rowIndex);
          }
        });
    },
    vote(imdb_id: string, votes: string[]) {
      call("api/vote/" + imdb_id, "POST")
        .then((data) => {
          if (!data.hasOwnProperty("statusCode")) {
            const vote_td = document.getElementById("table_movie_votes_td_" + imdb_id) as HTMLTableCellElement;
            const vote_div = document.getElementById("table_movie_votes_" + imdb_id) as HTMLDivElement;
            const new_vote_number = String(Number(vote_div.innerHTML) + 1);
            vote_div.innerHTML = new_vote_number
            vote_td.title = new_vote_number
            votes.push(imdb_id);
          }
        });
    },
    unvote(imdb_id: string, votes: any[]) {
      call("api/vote/" + imdb_id, "DELETE")
        .then((data) => {
          if (!data.hasOwnProperty("statusCode")) {
            const vote_td = document.getElementById("table_movie_votes_td_" + imdb_id) as HTMLTableCellElement;
            const vote_div = document.getElementById("table_movie_votes_" + imdb_id) as HTMLDivElement;
            const new_vote_number = String(Number(vote_div.innerHTML) - 1);
            vote_div.innerHTML = new_vote_number
            vote_td.title = new_vote_number

            const slice_index = votes.indexOf(imdb_id);
            delete votes[slice_index];
          }
        });
    }
  }
});
</script>

<style scoped>
.main {
  width: 90vw;
  margin: 20px auto;
}
</style>
