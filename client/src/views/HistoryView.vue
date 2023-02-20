<template>
  <TableComponent id="table_history" :head="[$t('history.watched_at'), $t('history.title')]" sortable :sort_default="[0, 'desc']" style="width: 90vw; margin: 20px auto;">
    <tr v-for="movie in history">
      <td :title="movie.watched_at.toString()">{{ (new Date(movie.watched_at)).toLocaleDateString() }}</td>
      <td :title="movie.title"><a :href="movie.link" target="_blank">{{ movie.title }}</a></td>
    </tr>
  </TableComponent>
</template>

<script lang="ts">
import TableComponent from "@/components/TableComponent.vue";
import { ref, defineComponent } from "vue";
import { call } from "@/util/api";
import type { History } from "@prisma/client";

export default defineComponent({
  name: "HistoryComponent",
  components: { TableComponent },
  setup() {
    const history = ref([] as History[])
    call("/api/movie/history")
      .then((data: History[]) => {
        history.value = data;
      });

    return {
      history
    }
  }
});
</script>

<style scoped>

</style>