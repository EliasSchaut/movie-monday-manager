<template>
<div id="card_profile" class="card text-center">
  <div class="card-header">
    Profile
  </div>
  <div class="card-body d-flex flex-column justify-content-between">
    <div class="mb-3">
      <img v-if="user.use_gravatar" class="card-img-top" :src="user.gravatar_url" alt="Profile Picture" id="profile_picture">
      <img v-else class="card-img-top" src="../assets/img/Portrait_Placeholder.png" alt="Placeholder Picture" id="profile_picture">
      <h5 class="card-title">{{ user.name }}</h5>
      <button type="button" class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#modal_profile">Edit Profile</button>
    </div>
    <div class="d-flex flex-row justify-content-around mb-3">
      <div class="d-flex flex-column align-items-start">
        <strong>Email:</strong>
        <p>{{ user.username }}</p>
        <button class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#modal_change_email">Change Email</button>
      </div>
      <div class="d-flex flex-column align-items-start">
        <strong>Password:</strong>
        <p class="card-text">***</p>
        <button class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#modal_change_password">Change Password</button>
      </div>
    </div>
    <div class="card text-center">
      <div class="card-header">
        Options
      </div>
      <ul class="list-group list-group-flush">
        <li class="list-group-item"><a @click.prevent="get_user_data" href="">Get all user data</a></li>
        <li class="list-group-item"><a style="color: red" href="">Delete account</a></li>
      </ul>
    </div>
  </div>
</div>

<!-- Modal: Change Profile -->
<ModalComponent id="modal_profile" title="Edit Profile">
  <form @submit.prevent="on_submit" action="/api/user" method="post"
        class="d-flex flex-column was-validated">
    <NameComponent :value="user.name" />
    <InputComponent id="check" class="form-check-input" type="checkbox" role="switch" label="Use Gravatar?" name="use_gravatar" :checked="user.use_gravatar" />
    <SubmitComponent inner_text="Update" />
  </form>
</ModalComponent>


<!-- Modal: Change Email -->
<ModalComponent id="modal_change_email" title="Change Email">
  <form @submit.prevent="on_submit" action="/api/user/username" method="post"
        class="d-flex flex-column justify-content-around was-validated">
    <EmailComponent label="New email" :value="user.username"/>
    <PasswordComponent label="Confirm with password" />
    <SubmitComponent inner_text="Update" />
  </form>
</ModalComponent>

<!-- Modal: Change Password -->
<ModalComponent id="modal_change_password" title="Change Password">
  <form @submit.prevent="on_submit" action="/api/suer/password" method="post"
        class="d-flex flex-column justify-content-around was-validated">
    <PasswordComponent type="tripple" />
    <SubmitComponent inner_text="Update" />
  </form>
</ModalComponent>
</template>

<script lang="ts">
import { call } from "@/components/ts/api";
import PasswordComponent from "@/components/util/form/PasswordComponent.vue";
import ModalComponent from "@/components/util/ModalComponent.vue";
import SubmitComponent from "@/components/util/form/SubmitComponent.vue";
import EmailComponent from "@/components/util/form/EmailComponent.vue";
import NameComponent from "@/components/util/form/NameComponent.vue";
import InputComponent from "@/components/util/form/InputComponent.vue";
import { ref } from "vue";
const user = ref({})

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
      submit: "Update",
      user: user
    };
  },
  setup() {
    fetch_user()
  },
  methods: {
    on_submit(e: SubmitEvent) {
      const form = e.target as HTMLFormElement;
      const form_data = new FormData(form);
      const post = {} as any;
      form_data.forEach((value, key) => {
        post[key] = value;
      });
      console.log(post);
      call(form.action, form.method, post).then(() => {
        fetch_user().then(() => {
          form.setAttribute("data-bs-dismiss", "modal");
          form.click()
          form.removeAttribute("data-bs-dismiss");
        });
      });
    },
    get_user_data() {
      call("/api/user/data").then((data) => {
        const a = document.createElement("a");
        a.href = URL.createObjectURL(new Blob([JSON.stringify(data)], { type: "application/json" }));
        a.setAttribute("download", "user_data.json");
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
      })
    }
  }
};

function fetch_user(): Promise<void> {
  return call("/api/user").then((data) => {
    user.value = data;
  });
}
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