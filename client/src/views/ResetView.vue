<template>
  <FormComponent :title="$t('reset.title')" :route="route" :callback="callback">
    <PasswordComponent type="double" label="Enter new Password" />
  </FormComponent>
</template>

<script lang="ts">
import PasswordComponent from "@/components/form/PasswordComponent.vue";
import SubmitComponent from "@/components/form/SubmitComponent.vue";
import FormComponent from "@/components/form/FormComponent.vue";
import router from "@/router/router";
import { defineComponent, ref } from "vue";
const challenge = ref("" as string)

export default defineComponent({
  name: "ResetView",
  data() {
    return {
      route: `/api/auth/reset/${challenge.value}`
    }
  },
  components: { FormComponent, SubmitComponent, PasswordComponent },
  methods: {
    callback(e: SubmitEvent, post: any, data: any) {
      if (data.hasOwnProperty("statusCode") && data.statusCode === 404) {
        return
      } else {
        router.push("../login");
      }
    }
  },
  setup() {
    challenge.value = router.currentRoute.value.params.challenge as string
  }
});
</script>

<style scoped>

</style>