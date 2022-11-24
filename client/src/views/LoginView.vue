<template>
  <FormComponent :title="title" :route="route" :callback="callback">
    <EmailComponent />
    <PasswordComponent type="single" />
  </FormComponent>
</template>

<script lang="ts">
import FormComponent from "@/components/FormComponent.vue";
import EmailComponent from "@/components/util/form/EmailComponent.vue";
import PasswordComponent from "@/components/util/form/PasswordComponent.vue";
import router from "@/router/router";
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
        localStorage.setItem("access_token", data.access_token);
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
