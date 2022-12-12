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
            <router-link class="nav-link" to="/">Home</router-link>
          </li>
          <li>
            <router-link class="nav-link" to="/history">History</router-link>
          </li>
          <li>
            <router-link class="nav-link" to="/privacy">Privacy</router-link>
          </li>
          <li>
            <router-link class="nav-link" to="/docs">Docs</router-link>
          </li>
          <li>
            <a class="nav-link" href="https://github.com/EliasSchaut/Movie-Monday-Manager" target="_blank">GitHub</a>
          </li>
        </ul>
        <div class="me-lg-1 spinner-border text-secondary" role="status" v-if="store.loading">
          <span class="visually-hidden">Loading...</span>
        </div>
        <router-link class="btn btn-success" type="button" to="/login" v-if="!store.logged_in">Login</router-link>
        <router-link class="btn btn-primary" type="button" to="/register" v-if="!store.logged_in">Register</router-link>
        <router-link class="btn btn-outline-primary" type="button" to="/profile" v-if="store.logged_in">Profile</router-link>
        <router-link class="btn btn-danger" type="button" to="/logout" v-if="store.logged_in">Logout</router-link>
      </div>
    </div>
  </nav>
</template>

<script lang="ts" setup>
import { store } from '@/util/store'
</script>

<script lang="ts">
export default {
  name: "NavbarComponent",
};
</script>

<style scoped>
.btn {
  margin-left: 10px;
}
</style>