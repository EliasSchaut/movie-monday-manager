<template>
  <FormComponent :title="title" :route="route" :callback="callback">
    <EmailComponent />
    <PasswordComponent type="single" />
    <router-link class="mb-3" to="/reset/">Forgot Password?</router-link>
  </FormComponent>
</template>

<script lang="ts">
import FormComponent from "@/components/form/FormComponent.vue";
import EmailComponent from "@/components/form/EmailComponent.vue";
import PasswordComponent from "@/components/form/PasswordComponent.vue";
import router from "@/router/router";
import { set_cookie } from "@/util/cookie"
import { call } from "@/util/api";

export default {
  data() {
    return {
      title: "Log In!",
      route: "/api/auth/login",
    }
  },
  components: { FormComponent, EmailComponent, PasswordComponent },
  methods: {
    callback(e: SubmitEvent, post: any, data: any) {
      if (data.hasOwnProperty("access_token")) {
        set_cookie("access_token", data.access_token);
        router.push("/");
      } else if (data.hasOwnProperty("statusCode") && data.statusCode === 409) {
        return
      } else {
        router.push("../login");
      }
    }
  },
  mounted() {
    const challenge = router.currentRoute.value.params.challenge
    if (challenge) {
      call("/api/auth/confirm/" + challenge)
    }
  }
}
</script>

<style scoped>

</style>
