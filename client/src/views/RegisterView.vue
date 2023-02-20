<template>
  <FormComponent :title="$t('register.title')" :route="route" :callback="callback">
    <NameComponent />
    <EmailComponent />
    <PasswordComponent type="double" />
  </FormComponent>
</template>

<script lang="ts">
import FormComponent from "@/components/form/FormComponent.vue";
import NameComponent from "@/components/form/NameComponent.vue";
import EmailComponent from "@/components/form/EmailComponent.vue";
import PasswordComponent from "@/components/form/PasswordComponent.vue";
import router from "@/router/router";
import { defineComponent } from "vue";

export default defineComponent({
  data() {
    return {
      route: "/api/auth/register",
    }
  },
  components: { FormComponent, NameComponent, EmailComponent, PasswordComponent },
  methods: {
    callback(e: SubmitEvent, post: any, data: any) {
      if (data.hasOwnProperty("statusCode") && data.statusCode === 409) {
        return
      } else {
        router.push("../login");
      }
    }
  }
})
</script>

<style scoped>

</style>
