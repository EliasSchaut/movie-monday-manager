<template>
  <div class="d-flex flex-column">
    <div v-if="filterable" class="dropdown mb-2 align-self-end">
      <button type="button" class="btn btn-primary dropdown-toggle" data-bs-toggle="dropdown" aria-expanded="false"
              data-bs-auto-close="outside">
        <img src="../assets/svg/filter.svg" alt="filter_icon">
      </button>
      <div class="dropdown-menu">
        <label v-for="(column, index) in head" class="dropdown-item d-flex justify-content-between"
               :for="'movie_filter_' + column">
          <input :id="'movie_filter_' + column" type="checkbox" checked @input="(e) => filter(e, id, index)">
          <div v-html="'&nbsp;&nbsp;' + column" />
        </label>
      </div>
    </div>

    <div class="table-responsive">
      <table :id="id" class="table table-striped table-bordered table-active">
        <thead>
        <tr class="table-dark align-middle">
          <th v-if="sortable" v-for="(column, index) in head"
              @click="(e) => {
                for(i = 0; i < head.length; i++) {
                  if (i !== index) {
                    sort_dir[i] = 'none';
                  } else {
                    sort_dir[i] = sort_loop[sort_dir[index]];
                  }
                }
                sort(e, id, sort_dir[index])
              }">
            <div class="d-flex justify-content-between flex-row">
              <div />
              <div v-html="column" />
              <img v-if="sort_dir[index] === 'asc'" src="../assets/svg/sort-alpha-down.svg" alt="sort_icon_down">
              <img v-else-if="sort_dir[index] === 'desc'" src="../assets/svg/sort-alpha-up.svg" alt="sort_icon_up">
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
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from "vue";

export default defineComponent({
  name: "TableComponent",
  data() {
    return {
      sort_loop: {
        none: "asc",
        asc: "desc",
        desc: "asc"
      } as any,
      i: 0
    };
  },
  setup(props) {
    return {
      sort_dir: ref(Array(props.head.length).fill("none"))
    };
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
      const table = document.getElementById(table_id) as HTMLTableElement;
      const th = e.currentTarget as HTMLTableCellElement;
      const clicked_col = th.cellIndex;
      const rows = table.rows;
      let not_sorted = true;

      // BubbleSort
      while (not_sorted) {
        not_sorted = false;

        for (let i = 1; i < (rows.length - 1); i++) {
          let x = rows[i].getElementsByTagName("td")[clicked_col] as HTMLElement;
          let y = rows[i + 1].getElementsByTagName("td")[clicked_col] as HTMLElement;

          const x_link = x.getElementsByTagName("a");
          const y_link = y.getElementsByTagName("a");
          if (x_link.length !== 0) {
            x = x_link[0];
          }

          if (y_link.length !== 0) {
            y = y_link[0];
          }

          if (sort_dir === "asc") {
            if (x.innerHTML.toLowerCase() > y.innerHTML.toLowerCase()) {
              (rows[i].parentNode as ParentNode).insertBefore(rows[i + 1], rows[i]);
              not_sorted = true;
            }
          } else if (sort_dir === "desc") {
            if (x.innerHTML.toLowerCase() < y.innerHTML.toLowerCase()) {
              (rows[i].parentNode as ParentNode).insertBefore(rows[i + 1], rows[i]);
              not_sorted = true;
            }
          }
        }
      }
    },
    filter(e: Event, table_id: string, cell_index: number) {
      const toggle = (e.target as HTMLInputElement).checked;
      const table = document.getElementById(table_id) as HTMLTableElement;
      const rows = table.rows;

      for (const row of rows) {
        const td = row.cells[cell_index];
        td.style.display = (toggle) ? "" : "none";
      }
    }
  }
});
</script>

<style scoped>

</style>