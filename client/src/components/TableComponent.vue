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
          <input :id="'movie_filter_' + column" type="checkbox" :checked="filter_values[index]" @input="(e: Event) => filter(id, index, (e.target as HTMLInputElement).checked)">
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
        <tbody style="text-align: center; vertical-align: middle">
        <slot />
        </tbody>
      </table>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from "vue";
import { get_cookie, set_cookie } from "@/util/cookie";

export default defineComponent({
  name: "TableComponent",
  data() {
    return {
      sort_loop: {
        none: "asc",
        asc: "desc",
        desc: "asc"
      } as any,
      i: 0,
      filter_values: this.get_filter_cookie(),
      first_update: false
    };
  },
  setup(props) {
    return {
      sort_dir: ref(Array(props.head.length).fill("none")),
    };
  },
  updated() {
    if (this.filterable && !this.first_update) {
      console.log("filter", this.filter_values);
      for (let i = 0; i < this.filter_values.length; i++) {
        this.filter(this.id, i, this.filter_values[i]);
      }
      this.first_update = true;
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
          const x_div = x.getElementsByTagName("div");
          const y_div = y.getElementsByTagName("div");
          if (x_link.length !== 0) {
            x = x_link[0];
          } else if (x_div.length > 1) {
            x = x_div[1];
          }

          if (y_link.length !== 0) {
            y = y_link[0];
          } else if (y_div.length > 1) {
            y = y_div[1];
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
    filter(table_id: string, cell_index: number, set_visible: boolean) {
      const table = document.getElementById(table_id) as HTMLTableElement;
      const rows = table.rows;

      for (const row of rows) {
        const td = row.cells[cell_index];
        td.style.display = (set_visible) ? "" : "none";
      }
      this.filter_values[cell_index] = set_visible;
      this.set_filter_cookie(this.filter_values);
    },
    get_filter_cookie() : boolean[] {
      const filter_cookie = get_cookie("table_filter_" + this.id)
      return (filter_cookie) ? JSON.parse(filter_cookie) as boolean[] : Array(this.head.length).fill(true);
    },
    set_filter_cookie(filter_values: boolean[]) {
      set_cookie("table_filter_" + this.id, JSON.stringify(filter_values), 365)
    }
  }
});
</script>

<style scoped>

</style>