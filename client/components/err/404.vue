<template>
  <Err
    :code="404"
    :title="$t('common.err.404.title')"
    :desc="$t('common.err.404.desc')"
  />
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'Err404',
});
</script>
