<template>
<div id="card_profile" class="card text-center">
  <div class="card-header">
    Profile
  </div>
  <div class="card-body d-flex flex-column justify-content-between">
    <div class="mb-3">
      <img class="card-img-top" src="../assets/img/Portrait_Placeholder.png" alt="Profile Picture" id="profile_picture">
      <h5 class="card-title">Elias Schaut</h5>
      <button type="button" class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#modal_profile">Edit Profile</button>
    </div>
    <div class="d-flex flex-row justify-content-around">
      <div class="d-flex flex-column align-items-start">
        <strong>Email:</strong>
        <p>eschaut@web.de</p>
        <button class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#modal_change_email">Change Email</button>
      </div>
      <div class="d-flex flex-column align-items-start">
        <strong>Password:</strong>
        <p class="card-text">***</p>
        <button class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#modal_change_password">Change Password</button>
      </div>
    </div>
  </div>
</div>

<!-- Modal: Change Profile -->
<div class="modal fade" id="modal_profile" tabindex="-1" aria-labelledby="modal_profile_label" aria-hidden="true">
  <div class="modal-dialog">
    <div class="modal-content">
      <div class="modal-header">
        <h5 class="modal-title" id="modal_profile_label">Edit Profile</h5>
        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
      </div>
      <div class="modal-body d-flex flex-column justify-content-between">
        <form @submit.prevent="" class="d-flex flex-column justify-content-around was-validated">
          <div class="d-flex flex-column align-items-start mb-3">
            <label for="form_name" class="form-label">Name</label>
            <input type="text" class="form-control" id="form_name" placeholder="Max Mustermann" name="name" value="Elias Schaut" required>
          </div>
          <div class="d-flex flex-column align-items-start mb-3">
            <label for="form_gravatar" class="form-label">Gravatar-Url:</label>
            <input type="url" class="form-control" id="form_gravatar" placeholder="https://s.gravatar.com/avatar/12345" name="gravatar">
          </div>
          <button type="submit" class="btn btn-success">Submit</button>
        </form>
      </div>
    </div>
  </div>
</div>

<!-- Modal: Change Email -->
<div class="modal fade" id="modal_change_email" tabindex="-1" aria-labelledby="modal_change_email_label" aria-hidden="true">
  <div class="modal-dialog">
    <div class="modal-content">
      <div class="modal-header">
        <h5 class="modal-title" id="modal_change_email_label">Change Email</h5>
        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
      </div>
      <div class="modal-body d-flex flex-column justify-content-between">
        <form @submit.prevent="" class="d-flex flex-column justify-content-around was-validated">
          <div class="d-flex flex-column align-items-start mb-3">
            <label for="form_username" class="form-label">Email:</label>
            <input type="email" class="form-control" id="form_username" placeholder="max@mustermann.de" name="username" value="eschaut@web.de" required>
          </div>
          <button type="submit" class="btn btn-success">Submit</button>
        </form>
      </div>
    </div>
  </div>
</div>

<!-- Modal: Change Password -->
<div class="modal fade" id="modal_change_password" tabindex="-1" aria-labelledby="modal_change_password_label" aria-hidden="true">
  <div class="modal-dialog">
    <div class="modal-content">
      <div class="modal-header">
        <h5 class="modal-title" id="modal_change_password_label">Change Password</h5>
        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
      </div>
      <div class="modal-body d-flex flex-column justify-content-between">
      <form @submit.prevent="" class="d-flex flex-column justify-content-around was-validated">
        <PasswordComponent type="double" />
        <button type="submit" class="btn btn-success">Submit</button>
      </form>
      </div>
    </div>
  </div>
</div>
</template>

<script lang="ts">
import { ref } from "vue";
import { call } from "@/components/ts/api";
import PasswordComponent from "@/components/util/PasswordComponent.vue";
const user = ref({} as any)

export default {
  name: "ProfileComponent",
  components: { PasswordComponent },
  data() {
    return {
      user
    };
  },
  setup() {
    call("api/profile")
      .then((data) => { user.value = data; })
  }
};
</script>

<style scoped>
#card_profile {
  width: min(500px, 90vw);
  margin: 20px auto
}

#profile_picture {
  width: min(100px, 20vw);
  border-radius: 50%;
  margin: 0 auto 10px;
  display: block;
}

p {
  margin: 0;
}
</style>