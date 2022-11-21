import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import LoginView from '../views/LoginView.vue'
import RegisterView from '../views/RegisterView.vue'
import ProfileView from '../views/ProfileView.vue'
import HistoryView from '../views/HistoryView.vue'
import PrivacyView from '../views/PrivacyView.vue'
import { store } from "@/util/store";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView
    },
    {
      path: '/login/:confirm?',
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
    },
    {
      path: '/history',
      name: 'history',
      component: HistoryView
    },
    {
      path: '/privacy',
      name: 'privacy',
      component: PrivacyView
    }
  ]
})

router.beforeEach((to, from, next) => {
  if (to.path === "/logout") {
    localStorage.removeItem("access_token");
    store.logged_in = false;
    router.go(0);
  }
  else if (localStorage.getItem("access_token")) {
    store.update_logged_in().then(() => {
      if (!store.logged_in) {
        localStorage.removeItem("access_token");
      }
      next()
    })
  } else {
    next()
  }

})

export default router
