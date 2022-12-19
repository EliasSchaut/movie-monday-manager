<template>
  <nav class="navbar navbar-expand-lg navbar-light bg-light sticky-top">
    <div class="container-fluid">
      <router-link class="navbar-brand" to="/">Movie Monday Manager</router-link>
      <button class="navbar-toggler" type="button" data-bs-toggle="collapse"
              data-bs-target="#navbarSupportedContent"
              aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
        <span class="navbar-toggler-icon"></span>
      </button>
      <div class="collapse navbar-collapse justify-content-end" id="navbarSupportedContent">
        <ul class="navbar-nav me-auto mb-2 mb-lg-0">
          <li class="nav-item">
            <router-link class="nav-link" to="/">{{ $t("nav.home") }}</router-link>
          </li>
          <li>
            <router-link class="nav-link" to="/history">{{ $t("nav.history") }}</router-link>
          </li>
          <li>
            <router-link class="nav-link" to="/privacy">{{ $t("nav.privacy") }}</router-link>
          </li>
          <li>
            <router-link class="nav-link" to="/docs">{{ $t("nav.docs") }}</router-link>
          </li>
          <li>
            <a class="nav-link" href="https://github.com/EliasSchaut/Movie-Monday-Manager" target="_blank">GitHub</a>
          </li>
        </ul>

        <div class="d-flex justify-content-end">
          <div class="me-lg-1 spinner-border text-secondary" role="status" v-if="store.loading">
            <span class="visually-hidden">Loading...</span>
          </div>
          <select class="form-select" aria-label="Default select example" @change="change_lang" v-model="lang">
            <option value="en">{{ $t("nav.lang.en") }}</option>
            <option value="de">{{ $t("nav.lang.de") }}</option>
          </select>
          <router-link class="btn btn-success" type="button" to="/login" v-if="!store.logged_in">{{ $t("nav.login") }}</router-link>
          <router-link class="btn btn-primary" type="button" to="/register" v-if="!store.logged_in">{{ $t("nav.register") }}</router-link>
          <router-link class="btn btn-outline-primary" type="button" to="/profile" v-if="store.logged_in">{{ $t("nav.profile") }}</router-link>
          <router-link class="btn btn-danger" type="button" to="/logout" v-if="store.logged_in">{{ $t("nav.logout") }}</router-link>
        </div>
      </div>
    </div>
  </nav>
</template>

<script lang="ts" setup>
import { store } from '@/util/store'
</script>

<script lang="ts">
import { ref } from "vue";
import { set_cookie } from "@/util/cookie";

export default {
  name: "NavbarComponent",
  data() {
    return {
      lang: ref(this.$i18next.language || "en"),
    }
  },
  methods: {
    change_lang: function (event: any) {
      const new_lang = event.target.value as "en" | "de"
      this.$i18next.changeLanguage(new_lang)
      set_cookie("lang", new_lang)
    }
  }
};
</script>

<style scoped>
.btn {
  margin-left: 10px;
}
</style>