<template>
  <!-- From ------------------------------------------------------->
  <div class="form-intro">
    <p class="big"><b>{{ head[route] }}</b></p>
  </div>
  <form :action="route_base + route" @submit.prevent="onSubmit" id="form_register" class="form was-validated" novalidate>
    <div class="mb-3" v-if="route === 'register'">
      <label for="form_name" class="form-label">{{ form.name }}</label>
      <input type="text" class="form-control" id="form_name" placeholder="Max Mustermann" name="name" pattern="^[A-Z](.*)$" required>
      <div class="valid-feedback">
        Looks good!
      </div>
      <div class="invalid-feedback">
        Should start with a capital letter.
      </div>
    </div>
    <div class="mb-3">
      <label for="form_username" class="form-label">{{ form.username }}</label>
      <input type="text" class="form-control" id="form_username" placeholder="max@mustermann.de" name="username" pattern="[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$" required>
      <div class="valid-feedback">
        Looks good!
      </div>
      <div class="invalid-feedback">
        Please enter a valid email address!
      </div>
    </div>
    <div class="mb-3">
      <label for="form_password" class="form-label">{{ form.password }}</label>
      <input type="password" class="form-control" id="form_password" placeholder="•••" name="password"
             pattern="^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$" required>
      <div class="valid-feedback">
        Looks good!
      </div>
      <div class="invalid-feedback">
        Minimum eight characters, at least one letter and one number!
      </div>
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
import { call } from "@/components/ts/api";

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
        username: "E-Mail",
        password: "Password",
        name: "Name",
        submit: {
          name: "Submit",
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
      if (!form_html.checkValidity()) {
        return
      }

      const form = new FormData(form_html);
      const post = {} as any;
      form.forEach((value, key) => {
        post[key] = value;
      });

      call(form_html.action, "POST", post)
        .then((res) => res.json())
        .then((data) => {
          if (data.hasOwnProperty("access_token")) {
            localStorage.setItem("access_token", data.access_token);
            router.push("/");
          } else {
            router.push("../login");
          }
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