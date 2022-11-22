<template>
  <h1 class="form-intro">Password Reset Request</h1>

  <form :action="route" method="post" class="form was-validated">
    <EmailComponent />
    <SubmitComponent @submit.prevent="submit"/>
  </form>
</template>

<script lang="ts">
import EmailComponent from "@/components/util/form/EmailComponent.vue";
import SubmitComponent from "@/components/util/form/SubmitComponent.vue";
import { call } from "@/util/api";
import router from "@/router/router";
export default {
  name: "ResetRequestView",
  data() {
    return {
      route: "/api/reset/"
    }
  },
  components: { SubmitComponent, EmailComponent },
  methods: {
    submit(e: SubmitEvent) {
      const form_html = e.target as HTMLFormElement;
      if (!form_html.checkValidity()) {
        return
      }

      const form = new FormData(form_html);
      const post = {} as any;
      form.forEach((value, key) => {
        post[key] = value;
      });

      call(form_html.action, form_html.method, post)
        .then(() => {
          router.push("../login");
        })
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
  width: min(400px, 80vw);
  display: flex;
  flex-direction: column;
  justify-content: space-around;
}
</style>