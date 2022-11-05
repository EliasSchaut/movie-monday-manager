import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import LoginView from '../views/LoginView.vue'
import RegisterView from '../views/RegisterView.vue'
import ProfileView from '../views/ProfileView.vue'
import { store } from "@/components/util/store";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView
    },
    {
      path: '/login',
      name: 'login',
      component: LoginView
    },
    {
      path: '/register',
      name: 'register',
      component: RegisterView
    },
    {
      path: '/profile',
      name: 'profile',
      component: ProfileView
    }
  ]
})

router.beforeEach((to, from, next) => {
  if (to.path === "/logout") {
    localStorage.removeItem("access_token");
    store.logged_in = false;
    return router.push("/").then(next);
  }
  store.update_logged_in().then(next)
})

export default router
