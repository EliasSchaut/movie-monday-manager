<template>
  <Dropdown
    :compo="IconFlagDe"
    :items="[
      {
        label: $t('common.lang.de'),
        callback: () => setLocale('de'),
        icon: IconFlagDe,
      },
      {
        label: $t('common.lang.en'),
        callback: () => setLocale('en'),
        icon: IconFlagUk,
      },
    ]"
  >
    <IconFlagDe
      v-if="$i18n.locale === 'de'"
      class="h-5 w-5 text-gray-400 group-hover:text-gray-500"
    />
    <IconFlagUk
      v-else
      class="h-5 w-5 text-gray-400 group-hover:text-gray-500"
    />
  </Dropdown>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { IconFlagDe, IconFlagUk } from '#components';

export default defineComponent({
  name: 'SettingLang',
  methods: {
    IconFlagDe: () => IconFlagDe,
    IconFlagUk: () => IconFlagUk,
  },
  setup() {
    return {
      setLocale: useI18n().setLocale,
    };
  },
});
</script>
