<template>
  <div v-if="filterable" class="dropdown mb-2 float-end">
    <button type="button" class="btn btn-primary dropdown-toggle" data-bs-toggle="dropdown" aria-expanded="false" data-bs-auto-close="outside">
      <img src="../assets/svg/filter.svg" alt="filter_icon">
    </button>
    <ul class="dropdown-menu">
      <li v-for="column in head" class="dropdown-item d-flex justify-content-between">
        <input :id="'movie_filter_' + column" type="checkbox" checked>
        <div v-html="column" :data-bs-target="'movie_filter_' + column" />
      </li>
    </ul>
  </div>

  <div class="table-responsive">
    <table :id="id" class="table table-striped table-bordered table-active">
      <thead>
      <tr class="table-dark align-middle">
        <th v-if="sortable" v-for="column in head" @click="(e) => { sort_dir = sort_loop[sort_dir]; sort(e, id, sort_dir)}">
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

export default {
  name: "TableComponent",
  data() {
    return {
      sort_dir: ref("none"),
      sort_loop: {
        none: "asc",
        asc: "desc",
        desc: "asc"
      }
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
    },
    filterable: {
      type: Boolean,
      default: false
    }
  },
  methods: {
    sort(e: Event, table_id: string, sort_dir: string) {
      const table = document.getElementById(table_id) as HTMLTableElement
      const th = e.currentTarget as HTMLTableCellElement
      const clicked_col = th.cellIndex
      const rows = table.rows;
      let not_sorted = true

      // BubbleSort
      while (not_sorted) {
        not_sorted = false;

        for (let i = 1; i < (rows.length - 1); i++) {
          let x = rows[i].getElementsByTagName("td")[clicked_col] as HTMLElement;
          let y = rows[i + 1].getElementsByTagName("td")[clicked_col] as HTMLElement;

          const x_link = x.getElementsByTagName("a")
          const y_link = y.getElementsByTagName("a")
          if (x_link.length !== 0) {
            x = x_link[0]
          }

          if (y_link.length !== 0) {
            y = y_link[0]
          }

          if (sort_dir === "asc") {
            if (x.innerHTML.toLowerCase() > y.innerHTML.toLowerCase()) {
              (rows[i].parentNode as ParentNode).insertBefore(rows[i + 1], rows[i])
              not_sorted = true;
            }
          } else if (sort_dir === "desc") {
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