<template></template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'Sign_upGithub',
  setup() {
    if (process.server) {
      const code = useRoute().query.code;
      const runtime_config = useRuntimeConfig();
      const query = gql`
        query ($secret_api_key: String!, $name: String!) {
          server {
            id
            oauth(secret_api_key: $secret_api_key, name: $name) {
              name
              client_id
              client_secret
            }
          }
        }
      `;
      useAsyncQuery(query, {
        secret_api_key: runtime_config.api_secret,
        name: 'github',
      }).then((data) => {
        console.log(data.data.value);
      });
    }
  },
});
</script>
