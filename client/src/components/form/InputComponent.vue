<template>
  <div class="d-flex flex-column align-items-start mb-3">
    <label class="form-label">{{ label }}
      <i v-if="help !== ''">(<a :href="help" target="_blank">?</a>)</i>
    </label>
    <input v-if="_class !== 'form-control'" v-bind="$attrs" :name="name" :class="_class">
    <input v-else v-bind="$attrs" :name="name" class="form-control">
    <div class="valid-feedback">
      {{ $t('common.form.valid_feedback') }}
    </div>
    <div class="invalid-feedback" v-html="invalid_feedback" />
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  inheritAttrs: false,
  props: {
    label: {
      type: String,
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    invalid_feedback: {
      type: String,
      default: "",
    },
    _class: {
      type: String,
      default: "form-control",
    },
    help: {
      type: String,
      default: "",
    }
  },
});
</script>

<style scoped>

</style>