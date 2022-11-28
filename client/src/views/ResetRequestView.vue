<template>
  <FormComponent :title="title" :route="route" :method="method" :callback="callback" :skip_call="skip_call">
    <EmailComponent />
  </FormComponent>
</template>

<script lang="ts">
import EmailComponent from "@/components/form/EmailComponent.vue";
import FormComponent from "@/components/form/FormComponent.vue";
import router from "@/router/router";
import { call } from "@/util/api";

export default {
  name: "ResetRequestView",
  data() {
    return {
      title: "Password Reset Request",
      route: "/api/auth/reset/",
      method: "get",
      skip_call: true
    }
  },
  components: { FormComponent, EmailComponent },
  methods: {
    callback(e: SubmitEvent, post: any, data: any) {
      console.log(post)
      call("/api/auth/reset/" + post.username)
        .then(() => {
          router.push("../login");
        })
    }
  }
};
</script>

<style scoped>

</style>