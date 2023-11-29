<template>
  <Dropdown
    :items="[
      {
        label: $t('common.theme.light'),
        callback: () => settings.setTheme('light'),
        icon: SunIcon,
      },
      {
        label: $t('common.theme.dark'),
        callback: () => settings.setTheme('dark'),
        icon: MoonIcon,
      },
      {
        label: $t('common.theme.system'),
        callback: () => settings.setTheme('system'),
        icon: ComputerDesktopIcon,
      },
    ]"
  >
    <SunIcon
      v-if="settings.theme === 'light'"
      class="h-5 w-5 text-gray-400 group-hover:text-gray-500"
      aria-hidden="true"
    />
    <MoonIcon
      v-else-if="settings.theme === 'dark'"
      class="h-5 w-5 text-gray-400 group-hover:text-gray-500"
      aria-hidden="true"
    />
    <ComputerDesktopIcon
      v-else
      class="h-5 w-5 text-gray-400 group-hover:text-gray-500"
      aria-hidden="true"
    />
  </Dropdown>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import {
  SunIcon,
  MoonIcon,
  ComputerDesktopIcon,
} from '@heroicons/vue/24/outline';
import { settingsStore } from '~/store/settings';

export default defineComponent({
  name: 'SettingTheme',
  methods: { ComputerDesktopIcon, MoonIcon, SunIcon },
  components: {
    ComputerDesktopIcon,
    MoonIcon,
    SunIcon,
  },
  setup() {
    return {
      settings: settingsStore(),
    };
  },
});
</script>
