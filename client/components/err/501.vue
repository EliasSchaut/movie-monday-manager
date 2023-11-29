<template>
  <Err
    :code="501"
    :title="$t('common.err.501.title')"
    :desc="$t('common.err.501.desc')"
  />
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'Err501',
});
</script>
