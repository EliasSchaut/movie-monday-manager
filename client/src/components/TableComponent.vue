<template>
  <div class="table-responsive">
    <table :id="id" class="table table-striped table-bordered table-active">
      <thead>
      <tr class="table-dark align-middle">
        <th v-if="sortable" v-for="column in head" @click="(e) => sort(e, id)">
          <div class="d-flex justify-content-between flex-row">
            <div/>
            <div v-html="column" />
            <img v-if="sort_dir === 'asc'" src="../assets/svg/sort-alpha-down.svg" alt="sort_icon_down">
            <img v-else-if="sort_dir === 'desc'" src="../assets/svg/sort-alpha-up.svg" alt="sort_icon_up">
            <img v-else src="../assets/svg/filter.svg" alt="sort_icon_none">
          </div>
        </th>
        <th v-else v-for="column in head" v-html="column" />
      </tr>
      </thead>
      <tbody>
        <slot />
      </tbody>
    </table>
  </div>
</template>

<script lang="ts">
import { ref } from "vue";

const sort_dir = ref("none")
const sort_loop = {
  none: "asc",
  asc: "desc",
  desc: "asc"
} as any

export default {
  name: "TableComponent",
  data() {
    return {
      sort_dir
    }
  },
  props: {
    head: {
      type: Array,
      required: true
    },
    id: {
      type: String,
      required: true
    },
    sortable: {
      type: Boolean,
      default: false
    }
  },
  methods: {
    sort(e: Event, table_id: string) {
      sort_dir.value = sort_loop[sort_dir.value]

      const table = document.getElementById(table_id) as HTMLTableElement
      const th = e.currentTarget as HTMLTableCellElement
      const clicked_col = th.cellIndex
      const rows = table.rows;
      let not_sorted = true

      // BubbleSort
      while (not_sorted) {
        not_sorted = false;

        for (let i = 1; i < (rows.length - 1); i++) {
          const x = rows[i].getElementsByTagName("td")[clicked_col];
          const y = rows[i + 1].getElementsByTagName("td")[clicked_col];

          if (sort_dir.value === "asc") {
            if (x.innerHTML.toLowerCase() > y.innerHTML.toLowerCase()) {
              (rows[i].parentNode as ParentNode).insertBefore(rows[i + 1], rows[i])
              not_sorted = true;
            }
          } else if (sort_dir.value === "desc") {
            if (x.innerHTML.toLowerCase() < y.innerHTML.toLowerCase()) {
              (rows[i].parentNode as ParentNode).insertBefore(rows[i + 1], rows[i])
              not_sorted = true;
            }
          }
        }
      }
    }
  }
};
</script>

<style scoped>

</style>