<template>
<div>
  {{ user }}
</div>
</template>

<script lang="ts">
import { ref } from "vue";
import { call } from "@/components/ts/api";
const user = ref({})

export default {
  name: "ProfileComponent",
  data() {
    return {
      user
    };
  },
  setup() {
    call("api/profile")
      .then((data) => { user.value = data; })
  }
};
</script>

<style scoped>
  div {
    margin: 20px auto;
    text-align: center;
  }
</style>