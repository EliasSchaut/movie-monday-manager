<template>
  <!-- From ------------------------------------------------------->
  <div class="form-intro">
    <p class="big"><b>{{ head[route] }}</b></p>
  </div>
  <form :action="route_base + route" @submit.prevent="onSubmit" id="form_register" class="form needs-validation">
    <div class="mb-3">
      <label for="from_username" class="form-label">{{ form.username }}</label>
      <input type="text" class="form-control" id="from_username" placeholder="Max Mustermann" name="username" required>
    </div>
    <div class="mb-3">
      <label for="from_password" class="form-label">{{ form.password }}</label>
      <input type="password" class="form-control" id="from_password" placeholder="••••••••••••••••" name="password"
             required>
    </div>
    <button v-if="!loading.value" id="button_submit" type="submit" class="btn btn-primary form-submit"
            data-bs-placement="bottom">
      {{ form.submit.name }}
    </button>
    <button v-if="loading.value" id="button_loading" type="submit" class="btn btn-primary form-submit" disabled>
      <span class="spinner-grow spinner-grow-sm" role="status" aria-hidden="true"></span>
      {{ form.submit.loading }}
    </button>
  </form>
  <!----------------------------------------------------------------->
</template>

<script lang="ts">
import { ref } from "vue";
import router from "@/router";

let loading = ref(false);
export default {
  name: "LoginComponent",
  data() {
    return {
      route_base: "api/auth/",
      head: {
        login: "Melde dich an!",
        register: "Registriere dich!",
      },
      form: {
        username: "Benutzername",
        password: "Password",
        submit: {
          name: "Bestätigen",
          loading: "Fertigstellen..."
        }
      }
    };
  },
  props: {
    route: String
  },
  computed: {
    loading() {
      return loading;
    }
  },
  methods: {
    async onSubmit(e: SubmitEvent) {
      const form_html = e.target as HTMLFormElement;
      const form = new FormData(form_html);
      const post = {} as any;
      form.forEach((value, key) => {
        post[key] = value;
      });

      fetch(form_html.action, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(post)
      })
        .then((res) => res.json())
        .then((data) => {
          console.log(data);
          if (data.hasOwnProperty("access_token")) {
            localStorage.setItem("access_token", data.access_token);
          }
          router.push("/");
        });
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
  width: 400px;
  display: flex;
  flex-direction: column;
  justify-content: space-around;
}

.form-submit {
  margin-top: 20px
}
</style>