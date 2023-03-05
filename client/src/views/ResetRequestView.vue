<template>
  <FormComponent :title="$t('reset_request.title')" :route="route" :method="method" :callback="callback" :skip_call="skip_call">
    <EmailComponent />
  </FormComponent>
</template>

<script lang="ts">
import EmailComponent from "@/components/form/EmailComponent.vue";
import FormComponent from "@/components/form/FormComponent.vue";
import router from "@/router/router";
import { call } from "@/util/api";
import { defineComponent } from "vue";

export default defineComponent({
  name: "ResetRequestView",
  data() {
    return {
      route: "/api/auth/reset/",
      method: "get",
      skip_call: true
    }
  },
  components: { FormComponent, EmailComponent },
  methods: {
    callback(e: SubmitEvent, post: any) {
      call("/api/auth/reset/" + post.username)
        .then(() => {
          router.push("../login");
        })
    }
  }
});
</script>

<style scoped>

</style>