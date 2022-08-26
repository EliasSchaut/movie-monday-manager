<template>
  <!-- From ------------------------------------------------------->
  <div class="form-intro">
    <p class="big"><b>Melde dich an!</b></p>
  </div>
  <form method="post" action="/api/auth/register" id="form_register" class="form needs-validation">
    <div class="mb-3">
      <label for="from_username" class="form-label">Benutzername</label>
      <input type="text" class="form-control" id="from_username" placeholder="Max Mustermann" name="username" required>
    </div>
    <div class="mb-3">
      <label for="from_password" class="form-label">Password</label>
      <input type="password" class="form-control" id="from_password" placeholder="*******************" name="password" required>
    </div>
    <button v-if="!loading.value" id="button_submit" type="submit" class="btn btn-primary form-submit"
            data-bs-placement="bottom">
      {{ this.form.submit.name }}
    </button>
    <button v-if="loading.value" id="button_loading" type="submit" class="btn btn-primary form-submit" disabled>
      <span class="spinner-grow spinner-grow-sm" role="status" aria-hidden="true"></span>
      {{ this.form.submit.loading }}
    </button>
  </form>
  <!----------------------------------------------------------------->
</template>
<script lang="ts">
import { ref } from "vue";

let loading = ref(false);
export default {
  name: "LoginComponent",
  data() {
    return {
      form: {
        submit: {
          name: "Bestätigen",
          loading: "Fertigstellen..."
        }
      }
    };
  },
  computed: {
    loading() {
      return loading;
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