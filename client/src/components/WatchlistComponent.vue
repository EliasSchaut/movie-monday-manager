<template>
  <CardComponent v-if="watchlist.length > 0" id="watchlist" header="Watchlist">
    <TableComponent :head="head">
      <tr v-for="movie in watchlist">
        <td>{{ (new Date(movie.start_time)).toLocaleTimeString() }}</td>
        <td><a :href="movie.link" target="_blank">{{ movie.title }}</a></td>
        <td>
          <button class="btn btn-primary" disabled>?</button>
        </td>
      </tr>
    </TableComponent>
  </CardComponent>
</template>

<script lang="ts">
import CardComponent from "@/components/util/CardComponent.vue";
import TableComponent from "@/components/util/TableComponent.vue";
import { call } from "@/util/api";
import { ref } from "vue";

export default {
  name: "WatchlistComponent",
  components: { TableComponent, CardComponent },
  data() {
    return {
      head: ["Start", "Title", "Interested"]
    };
  },
  setup() {
    const watchlist = ref([]);
    call("/api/movie/watchlist")
      .then((data) => {
        watchlist.value = data;
      });

    return {
      watchlist
    };
  }
};
</script>

<style scoped>
#watchlist {
  width: min(90vw, 800px);
  margin: 20px auto;
}
</style>