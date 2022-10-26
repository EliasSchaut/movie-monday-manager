<template>
<div>
  {{ user }}
</div>
</template>

<script lang="ts">
import { ref } from "vue";
const user = ref({})

export default {
  name: "ProfileComponent",
  data() {
    return {
      user
    };
  },
  setup() {
    fetch("api/profile", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Authorization": "Bearer " + localStorage.getItem("access_token")
      }
    })
      .then((res) => res.json()
        .then(
          (data) => {
            user.value = data;
          }
        )
      )
  }
};
</script>

<style scoped>
  div {
    margin: 20px auto;
    text-align: center;
  }
</style>