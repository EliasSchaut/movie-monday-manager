<template>
  <h1 class="form-intro">{{ title }}</h1>

  <form v-bind="$attrs" :action="route" :method="method" @submit.prevent="(e: Event) => submit(e, callback, skip_call)" class="form was-validated">
    <slot />
    <SubmitComponent />
  </form>
</template>

<script lang="ts">
import SubmitComponent from "@/components/form/SubmitComponent.vue";
import { call } from "@/util/api";
import { defineComponent } from "vue";

export default defineComponent({
  name: "FormComponent",
  inheritAttrs: false,
  components: { SubmitComponent },
  props: {
    title: {
      type: String,
      required: true
    },
    route: {
      type: String,
      required: true
    },
    method: {
      type: String,
      default: "post"
    },
    callback: {
      type: Function,
      default: () => {return null}
    },
    skip_call: {
      type: Boolean,
      default: false
    }
  },
  methods: {
    submit(e: Event, callback: Function, skip_call: boolean) {
      const form_html = e.target as HTMLFormElement;
      if (!form_html.checkValidity()) {
        return
      }

      const form = new FormData(form_html);
      const post = {} as any;
      form.forEach((value, key) => {
        post[key] = value;
      });

      if (skip_call) {
        callback(e, post, null);
      } else {
        call(form_html.action, form_html.method, post)
          .then((data) => {
            callback(e, post, data);
          })
      }
    }
  }
});
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