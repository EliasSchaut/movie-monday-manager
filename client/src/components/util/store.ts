import { reactive } from  'vue';

export const store = reactive({
  logged_in: false,
  loading: false,

  update_loading(loading: boolean) {
    store.loading = loading;
  },

  async update_logged_in() {
    store.logged_in = (await fetch("api/profile/check", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Authorization": "Bearer " + localStorage.getItem("access_token")
      }
    })).status === 200;
  }
})
