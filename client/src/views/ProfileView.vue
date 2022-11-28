<template>
  <CardComponent id="card_profile" header="Profile">
    <div class="d-flex flex-column justify-content-between">
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

      <CardComponent header="Options" nobody>
        <ul class="list-group list-group-flush">
          <li class="list-group-item">
            <div class="form-switch">
              <input class="form-check-input" type="checkbox" role="switch" id="switch_emails" :checked="user.email_opt_in" name="email_opt_in" @click="opt_in_email">
              <label class="form-check-label ms-2" for="switch_emails">Receive emails</label>
            </div>
          </li>
          <li class="list-group-item"><a @click.prevent="get_user_data" href="">Get all user data</a></li>
          <li class="list-group-item"><a @click.prevent="" data-bs-toggle="modal" data-bs-target="#modal_delete_account" style="color: red" href="">Delete account</a></li>
        </ul>
      </CardComponent>
    </div>
  </CardComponent>

  <!-- Modal: Change Profile -->
  <ModalComponent id="modal_profile" title="Edit Profile">
    <form @submit.prevent="on_submit" action="/api/user" method="post"
          class="d-flex flex-column was-validated">
      <NameComponent :value="user.name" />
      <InputComponent id="check" _class="form-check-input" type="checkbox" role="switch"
                      label="Use Gravatar" help="https://en.gravatar.com/"
                      name="use_gravatar" :checked="user.use_gravatar" />
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
    <form @submit.prevent="on_submit" action="/api/user/password" method="post"
          class="d-flex flex-column justify-content-around was-validated">
      <PasswordComponent type="tripple" />
      <SubmitComponent inner_text="Update" />
    </form>
  </ModalComponent>

  <!-- Modal: Delete Account -->
  <ModalComponent id="modal_delete_account" title="Delete Account?">
    <p style="color: red">All your proposed movies, votes and user data will be irretrievable lost!</p>
    <br>
    <form @submit.prevent="delete_account" action="/api/user" method="post"
          class="d-flex flex-column justify-content-around was-validated">
      <PasswordComponent label="Confirm with password" />
      <SubmitComponent inner_text="Delete" class="btn btn-danger form-submit" />
    </form>
  </ModalComponent>
</template>

<script lang="ts">
import { call } from "@/util/api";
import PasswordComponent from "@/components/form/PasswordComponent.vue";
import ModalComponent from "@/components/ModalComponent.vue";
import SubmitComponent from "@/components/form/SubmitComponent.vue";
import EmailComponent from "@/components/form/EmailComponent.vue";
import NameComponent from "@/components/form/NameComponent.vue";
import InputComponent from "@/components/form/InputComponent.vue";
import { ref } from "vue";
import router from "@/router/router";
import CardComponent from "@/components/CardComponent.vue";
const user = ref({})

export default {
  name: "ProfileComponent",
  components: {
    CardComponent,
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
    },
    delete_account(e: SubmitEvent) {
      const form = e.target as HTMLFormElement;
      const form_data = new FormData(form);
      const post = {} as any;
      form_data.forEach((value, key) => {
        post[key] = value;
      });
      call(form.action, "Delete", post).then(() => {
        router.push("/").then(() => router.push("/logout"));
      });
    },
    opt_in_email(e: Event) {
      const checkbox = e.target as HTMLInputElement;
      call("/api/user/email_opt_in", "post", { email_opt_in: checkbox.checked })
    }
  }
};

function fetch_user(): Promise<void> {
  return call("/api/user").then((data) => {
    if (data.use_gravatar) {
      data.gravatar_url += "?s=100"
    }
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
