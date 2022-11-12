<template>
  <div class="d-flex flex-column align-items-start mb-3">
    <label class="form-label">{{ label }}</label>
    <input v-bind="$attrs" class="form-control" :name="name">
    <div class="valid-feedback">
      Looks good!
    </div>
    <div class="invalid-feedback" v-html="invalid_feedback" />
  </div>
</template>

<script>
export default {
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
  },
};
</script>

<style scoped>

</style>