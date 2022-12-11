<template>
  <TableComponent id="table_history" :head="head">
    <tr v-for="movie in history">
      <td>{{ (new Date(movie.watched_at)).toLocaleDateString() }}</td>
      <td><a :href="movie.link" target="_blank">{{ movie.title }}</a></td>
    </tr>
  </TableComponent>
</template>

<script lang="ts">
import TableComponent from "@/components/TableComponent.vue";
import { ref } from "vue";
import { call } from "@/util/api";
import { useTranslation } from "i18next-vue";
const { t } = useTranslation()

export default {
  name: "HistroyComponent",
  components: { TableComponent },
  data() {
    return {
      head: [t('history.watched_at'), t('history.title')]
    }
  },
  setup() {
    const history = ref([]);
    call("/api/movie/history")
      .then((data) => {
        history.value = data;
      });

    return {
      history
    }
  }
};
</script>

<style scoped>
#table_history {
  width: 90vw;
  margin: 20px auto;
}
</style>