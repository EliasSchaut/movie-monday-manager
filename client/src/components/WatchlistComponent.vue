<template>
  <CardComponent v-if="watchlist.length > 0" id="watchlist" header="Watchlist">
    <TableComponent :head="head">
      <tr v-for="movie in watchlist">
        <td>{{ (new Date(movie.start_time)).toLocaleString() }}</td>
        <td><a :href="movie.link" target="_blank">{{ movie.title }}</a></td>
        <td>
          <button class="btn btn-primary" @click="interested(movie.interested)"
                  data-bs-target="#modal_watchlist" data-bs-toggle="modal">
            <img src="../assets/svg/person-hearts.svg" alt="Heart" />
          </button>
        </td>
      </tr>
    </TableComponent>
  </CardComponent>

  <ModalComponent id="modal_watchlist" title="Interested">
    <TableComponent :head="head_modal">
      <tr v-for="user in interested_local">
        <td><img v-if="user.use_gravatar" :src="user.gravatar_url" alt="avatar" class="profile" />
        <img v-else src="../assets/img/Portrait_Placeholder.png" alt="placeholder_avatar" class="profile" /></td>
        <td>{{ user.name }}</td>
      </tr>
    </TableComponent>
  </ModalComponent>
</template>

<script lang="ts">
import CardComponent from "@/components/CardComponent.vue";
import TableComponent from "@/components/TableComponent.vue";
import ModalComponent from "@/components/ModalComponent.vue";
import { call } from "@/util/api";
import { ref } from "vue";
const interested_local = ref([] as any);

export default {
  name: "WatchlistComponent",
  components: { TableComponent, CardComponent, ModalComponent },
  data() {
    return {
      head: ["Start", "Title", "Interested"],
      head_modal: ["Profile", "Name"],
      interested_local: interested_local
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
  },
  methods: {
    interested(user_ids: number[]) {
      interested_local.value = [];
      for (const user_id of user_ids) {
        call(`/api/user/${user_id}`)
          .then((data) => {
            interested_local.value.push(data);
          });
      }
    }
  }
};
</script>

<style scoped>
#watchlist {
  width: min(90vw, 800px);
  margin: 20px auto;
}

#modal_watchlist {
  font-size: larger;
}

.profile {
  width: 40px;
  height: 40px;
  border-radius: 50%;
}
</style>