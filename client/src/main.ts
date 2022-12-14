import { createApp } from 'vue'
import App from './App.vue'
import i18next from "i18next";
import I18NextVue from "i18next-vue";
import router from './router/router'

import '@/plugins/bootstrap'
import '@/assets/css/main.css'

import en from '@/locales/en.json'
import de from '@/locales/de.json'
import { get_cookie } from "@/util/cookie";

i18next.init({
  lng: get_cookie("lang") || "en",
  resources: {
    en: { translation: en },
    de: { translation: de },
  }
}).then(() => {
  const app = createApp(App)
  app.use(I18NextVue, { i18next })
  app.use(router)
  app.mount('#app')
});
