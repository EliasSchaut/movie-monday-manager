<template>
  <div class="d-flex justify-content-between flex-row">
    <div v-if="show_votes" style="align-self: center">{{ movie_votes[imdb_id] }}</div>

    <VoteButtonComponent v-if="store.logged_in && proposed"
                         type="delete" @click="delete_media(imdb_id)" :disabled="!store.logged_in" />
    <VoteButtonComponent v-else-if="voted_movies.includes(imdb_id)" type="voted"
                         @click="unvote(imdb_id)" :disabled="!store.logged_in"/>
    <VoteButtonComponent v-else type="not_voted"
                         @click="vote(imdb_id)" :disabled="!store.logged_in"/>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from "vue";
import { call } from "@/util/api";
import { store } from "@/util/store";
import VoteButtonComponent from "@/components/movie/VoteButtonComponent.vue";

let first_voted_fetch = true
const voted_movies = ref([] as string[]);
const movie_votes = ref({} as {[imdb_id: string]: number})

export default defineComponent({
  name: "VoteComponent",
  components: { VoteButtonComponent },
  data() {
    return {
      store,
      voted_movies,
      movie_votes
    };
  },
  setup(props) {
    if (first_voted_fetch && store.logged_in) {
      first_voted_fetch = false
      call("api/vote")
        .then((data: string[]) => {
          voted_movies.value = data
        });
    }
    if (props.show_votes) {
      movie_votes.value[props.imdb_id] = props.votes;
    }
  },
  props:{
    imdb_id: {
      type: String,
      required: true
    },
    show_votes: {
      type: Boolean,
      default: false
    },
    votes: {
      type: Number,
      default: -1
    },
    proposed: {
      type: Boolean,
      default: false
    },
    delete_media: {
      type: Function,
      default: () => {}
    },
    on_vote: {
      type: Function,
      default: () => {}
    },
  },
  methods: {
    vote(imdb_id: string) {
      call("api/vote/" + imdb_id, "POST")
        .then((data) => {
          if (!data.hasOwnProperty("statusCode")) {
            const vote_td = document.getElementById("table_movie_votes_td_" + imdb_id) as HTMLTableCellElement;
            movie_votes.value[imdb_id]++;
            vote_td.title = String(movie_votes.value[imdb_id])
            voted_movies.value.push(imdb_id);
            this.on_vote(movie_votes.value[imdb_id])
          }
        });
    },
    unvote(imdb_id: string) {
      call("api/vote/" + imdb_id, "DELETE")
        .then((data) => {
          if (!data.hasOwnProperty("statusCode")) {
            const vote_td = document.getElementById("table_movie_votes_td_" + imdb_id) as HTMLTableCellElement;
            movie_votes.value[imdb_id]--;
            vote_td.title = String(movie_votes.value[imdb_id])

            const slice_index = voted_movies.value.indexOf(imdb_id);
            delete voted_movies.value[slice_index];
            this.on_vote(movie_votes.value[imdb_id])
          }
        });
    },
  }
});
</script>

<style scoped>

</style>