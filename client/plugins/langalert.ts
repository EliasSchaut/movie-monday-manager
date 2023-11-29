import { alertStore } from '@/store/alert';

export default defineNuxtPlugin((nuxtApp) => {
  const alert = alertStore();
  nuxtApp.hook('i18n:beforeLocaleSwitch', () => {
    alert.hide();
  });
});
