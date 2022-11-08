import { reactive } from  'vue';
import { call } from "@/components/ts/api";

export const store = reactive({
  logged_in: false,
  loading: false,

  update_loading(loading: boolean) {
    this.loading = loading;
  },

  async update_logged_in() {
    this.logged_in = (await call("api/profile/check")).status === 200;
  }
})
