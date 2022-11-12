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
<ModalComponent id="modal_profile" title="Edit Profile">
  <form @submit.prevent="" class="d-flex flex-column justify-content-around was-validated">
    <NameComponent />
    <InputComponent label="Gravatar-Url:" type="url" placeholder="https://www.gravatar.com/avatar/00000000000000000000000000000000"
                    name="gravatar_url" pattern="https://www.gravatar.com/avatar/[0-9a-f]{32}"
                    invalid_feedback="Not a valid gravatar url (e.g. https://www.gravatar.com/avatar/1234...)" required/>
    <PasswordComponent label="Confirm with password" />
    <SubmitComponent inner_text="Update" />
  </form>
</ModalComponent>


<!-- Modal: Change Email -->
<ModalComponent id="modal_change_email" title="Change Email">
  <form @submit.prevent="" class="d-flex flex-column justify-content-around was-validated">
    <EmailComponent label="New email" />
    <PasswordComponent label="Confirm with password" />
    <SubmitComponent inner_text="Update" />
  </form>
</ModalComponent>

<!-- Modal: Change Password -->
<ModalComponent id="modal_change_password" title="Change Password">
  <form @submit.prevent="" class="d-flex flex-column justify-content-around was-validated">
    <PasswordComponent type="tripple" />
    <SubmitComponent inner_text="Update" />
  </form>
</ModalComponent>
</template>

<script lang="ts">
import { ref } from "vue";
import { call } from "@/components/ts/api";
import PasswordComponent from "@/components/util/form/PasswordComponent.vue";
import ModalComponent from "@/components/util/ModalComponent.vue";
import SubmitComponent from "@/components/util/form/SubmitComponent.vue";
import EmailComponent from "@/components/util/form/EmailComponent.vue";
import NameComponent from "@/components/util/form/NameComponent.vue";
import InputComponent from "@/components/util/form/InputComponent.vue";
const user = ref({} as any)

export default {
  name: "ProfileComponent",
  components: {
    InputComponent,
    NameComponent,
    EmailComponent,
    SubmitComponent,
    PasswordComponent,
    ModalComponent
  },
  data() {
    return {
      user,
      submit: "Update"
    };
  },
  setup() {
    call("api/profile")
      .then((data) => { user.value = data; console.log(data); })
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