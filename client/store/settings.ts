export const settingsStore = defineStore('settings', {
  state: (): SettingsType => {
    const theme = useColorMode();
    return {
      theme: (theme.preference as SettingsType['theme']) || 'system',
    };
  },
  actions: {
    setTheme(theme: SettingsType['theme']) {
      this.theme = theme;
      useColorMode().preference = theme;
    },
  },
  persist: true,
});

class SettingsType {
  theme!: 'light' | 'dark' | 'system';
}
