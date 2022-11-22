<template>
  <!-- From ------------------------------------------------------->
  <div class="form-intro">
    <p class="big"><b>{{ head[route] }}</b></p>
  </div>
  <form :action="route_base + route" @submit.prevent="onSubmit" id="form_register" class="form was-validated">
    <NameComponent v-if="route === 'register'"/>
    <EmailComponent />
    <PasswordComponent v-if="route === 'register'" type="double" />
    <PasswordComponent v-else type="single" />
    <SubmitComponent />
  </form>
  <!----------------------------------------------------------------->
</template>

<script lang="ts">
import router from "@/router/router";
import { call } from "@/util/api";
import PasswordComponent from "@/components/util/form/PasswordComponent.vue";
import EmailComponent from "@/components/util/form/EmailComponent.vue";
import NameComponent from "@/components/util/form/NameComponent.vue";
import SubmitComponent from "@/components/util/form/SubmitComponent.vue";

export default {
  name: "LoginComponent",
  components: { SubmitComponent, NameComponent, EmailComponent, PasswordComponent },
  data() {
    return {
      route_base: "/api/auth/",
      head: {
        login: "Log In!",
        register: "Register!",
      }
    };
  },
  props: {
    route: String
  },
  methods: {
    async onSubmit(e: SubmitEvent) {
      const form_html = e.target as HTMLFormElement;
      if (!form_html.checkValidity()) {
        return
      }

      const form = new FormData(form_html);
      const post = {} as any;
      form.forEach((value, key) => {
        post[key] = value;
      });

      call(form_html.action, "POST", post)
        .then((data) => {
          if (data.hasOwnProperty("access_token")) {
            localStorage.setItem("access_token", data.access_token);
            router.push("/");
          } else if (data.hasOwnProperty("statusCode") && data.statusCode === 409) {
            return
          } else {
            router.push("../login");
          }
        })
    }
  },
  mounted() {
    const challenge = router.currentRoute.value.params.challenge
    if (challenge) {
      call("/api/auth/confirm/" + challenge)
    }
  }
};
</script>

<style scoped>
.form-intro {
  margin: 1em 0;
  text-align: center;
}

.form {
  margin: 30px auto 0;
  width: min(400px, 80vw);
  display: flex;
  flex-direction: column;
  justify-content: space-around;
}
</style>