import { createApp } from 'vue'
import App from './App.vue'
import router from './router/router'

import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.min.js";
import "bootstrap-table/dist/bootstrap-table.min.css";
import "bootstrap-table/dist/bootstrap-table.min.js";
import "./assets/css/main.css";

const app = createApp(App)
app.use(router)
app.mount('#app')
