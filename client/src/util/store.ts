import { reactive } from  'vue';
import { get_cookie } from "@/util/cookie";

export const store = reactive({
  logged_in: false,
  loading: false,
  alert: {
    show: false,
    msg: "",
    type: "success",
  },

  update_loading(loading: boolean) {
    this.loading = loading;
  },

  async update_logged_in() {
    const check = (await fetch("/api/user/check", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Authorization": "Bearer " + (get_cookie("access_token") ?? ""),
      }
    }));
    const data = await check.text()
    this.logged_in = data === "true"
  },

  generate_type(http_code: number) {
    if (http_code >= 200 && http_code < 300) {
      return "success";
    } else if (http_code >= 400 && http_code < 500) {
      return "warning";
    } else if (http_code >= 500 && http_code < 600) {
      return "danger";
    } else {
      return "info";
    }
  },

  show_alert(type: string, msg: string) {
    this.alert.type = type;
    this.alert.msg = msg;
    this.alert.show = true;
  },

  hide_alert() {
    this.alert.show = false;
  }
})
