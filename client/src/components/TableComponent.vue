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
                current_sort_cell = (e.currentTarget as HTMLTableCellElement).cellIndex;
                current_sort_dir = sort_dir[index];
              }">
            <div class="d-flex justify-content-between flex-row">
              <div />
              <div v-html="column" class="me-1" />
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
      first_update: true,
      loop_update: true,
    };
  },
  setup(props) {
    let current_sort_cell = 1
    let current_sort_dir = "asc"

    if (props.sort_default.length === 2) {
      current_sort_cell = props.sort_default[0] as number
      current_sort_dir = props.sort_default[1] as string
    }

    return {
      current_sort_cell: current_sort_cell,
      current_sort_dir: current_sort_dir,
      sort_dir: ref(Array(props.head.length).fill("none")),
    };
  },
  updated() {
    if (this.loop_update) {
      if (this.filterable) {
        this.filter_all()
      }
    }
    if (this.sortable) {
      this.sort(this.current_sort_cell, this.current_sort_dir);
    }
    if (this.first_update) {
      this.loop_update = false;
      this.first_update = false
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
    sort_default: {
      type: Array,
      default: []
    },
    filterable: {
      type: Boolean,
      default: false
    },
    filter_default: {
      type: Array,
      default: []
    }
  },
  methods: {
    sort(cell_index: number, sort_dir: string) {
      const table = document.getElementById(this.id) as HTMLTableElement;
      const rows = table.rows;
      let not_sorted = true;

      // BubbleSort
      while (not_sorted) {
        not_sorted = false;

        for (let i = 1; i < (rows.length - 1); i++) {
          let x = rows[i].getElementsByTagName("td")[cell_index] as HTMLElement;
          let y = rows[i + 1].getElementsByTagName("td")[cell_index] as HTMLElement;

          if (sort_dir === "asc") {
            if (x.title.toLowerCase() > y.title.toLowerCase()) {
              (rows[i].parentNode as ParentNode).insertBefore(rows[i + 1], rows[i]);
              not_sorted = true;
            }
          } else if (sort_dir === "desc") {
            if (x.title.toLowerCase() < y.title.toLowerCase()) {
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
    filter_all() {
      for (let i = 0; i < this.filter_values.length; i++) {
        this.filter(this.id, i, this.filter_values[i]);
      }
    },
    get_filter_cookie() : boolean[] {
      const filter_cookie = get_cookie("table_filter_" + this.id)
      if (filter_cookie) {
        const filter = JSON.parse(filter_cookie) as boolean[]
        if (filter.length === this.head.length) {
          return filter
        }
      }

      if (this.filter_default.length) {
        return this.filter_default as boolean[]
      } else {
        return Array(this.head.length).fill(true) as boolean[];
      }
    },
    set_filter_cookie(filter_values: boolean[]) {
      set_cookie("table_filter_" + this.id, JSON.stringify(filter_values), 365)
    }
  }
});
</script>

<style scoped>

</style>