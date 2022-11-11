<template>
  <div class="mb-3" v-if="type === 'double'">
    <label for="form_password" class="form-label">{{ password }}</label>
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
  <div class="mb-3" v-if="type === 'double'">
    <label for="form_password_confirm" class="form-label">{{ confirm }}</label>
    <input type="password" class="form-control" id="form_password_confirm" placeholder="•••" name="password_confirm"
           pattern="^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$" @input="check_password" required>
    <div class="valid-feedback">
      Looks good!
    </div>
    <div class="invalid-feedback">
      Should be the same as the password!
    </div>
  </div>
  <div class="mb-3" v-else>
    <label for="form_password" class="form-label">{{ password }}</label>
    <input type="password" class="form-control" id="form_password" placeholder="•••" name="password"
           pattern="^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$" required>
    <div class="valid-feedback">
      Looks good!
    </div>
    <div class="invalid-feedback">
      Minimum eight characters, at least one letter and one number!
    </div>
  </div>
</template>

<script lang="ts">
export default {
  name: "PasswordComponent",
  data() {
    return {
      password: "Password",
      confirm: "Retype password"
    }
  },
  props: {
    type: String
  },
  methods: {
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

</style>