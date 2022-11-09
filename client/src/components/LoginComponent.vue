<template>
  <!-- From ------------------------------------------------------->
  <div class="form-intro">
    <p class="big"><b>{{ head[route] }}</b></p>
  </div>
  <form :action="route_base + route" @submit.prevent="onSubmit" id="form_register" class="form was-validated">
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
      <input type="text" class="form-control" id="form_username" placeholder="max@mustermann.de" name="username" pattern="[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,7}$" required>
      <div class="valid-feedback">
        Looks good!
      </div>
      <div class="invalid-feedback">
        Please enter a valid email address!
      </div>
    </div>
    <div class="mb-3" v-if="route === 'register'">
      <label for="form_password" class="form-label">{{ form.password }}</label>
      <input type="password" class="form-control" id="form_password" placeholder="•••" name="password"
             pattern="^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$" @input="check_password" required>
      <div class="valid-feedback">
        Looks good!
      </div>
      <div class="invalid-feedback">
        - At least 8 characters<br>
        - Contains an uppercase letter, lowercase letter, and a number<br>
        - Can contain special characters
      </div>
    </div>
    <div class="mb-3" v-else>
      <label for="form_password" class="form-label">{{ form.password }}</label>
      <input type="password" class="form-control" id="form_password" placeholder="•••" name="password"
             pattern="^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$" required>
      <div class="valid-feedback">
        Looks good!
      </div>
      <div class="invalid-feedback">
        Minimum eight characters, at least one letter and one number!
      </div>
    </div>
    <div class="mb-3" v-if="route === 'register'">
      <label for="form_password_confirm" class="form-label">{{ form.confirm }}</label>
      <input type="password" class="form-control" id="form_password_confirm" placeholder="•••" name="password_confirm"
             pattern="^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$" @input="check_password" required>
      <div class="valid-feedback">
        Looks good!
      </div>
      <div class="invalid-feedback">
        Should be the same as the password!
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
        login: "Log In!",
        register: "Register!",
      },
      form: {
        username: "E-Mail",
        password: "Password",
        confirm: "Retype password",
        name: "Name",
        submit: {
          name: "Submit",
          loading: "Loading..."
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
    },
    async check_password() {
      const password = document.getElementById("form_password") as HTMLInputElement;
      const password_confirm = document.getElementById("form_password_confirm") as HTMLInputElement;
      if (password.value !== password_confirm.value) {
        password_confirm.setCustomValidity("Should be the same as the password!");
      } else {
        password_confirm.setCustomValidity("");
      }
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

.form-submit {
  margin-top: 20px
}
</style>