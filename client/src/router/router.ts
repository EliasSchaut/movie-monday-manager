import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import LoginView from '../views/LoginView.vue'
import ResetView from '../views/ResetView.vue'
import ResetRequestView from '../views/ResetRequestView.vue'
import RegisterView from '../views/RegisterView.vue'
import ProfileView from '../views/ProfileView.vue'
import HistoryView from '../views/HistoryView.vue'
import PrivacyView from '../views/PrivacyView.vue'
import { store } from "@/util/store";
import { get_cookie, remove_cookie } from "@/util/cookie";
import DocsView from "@/views/DocsView.vue";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView
    },
    {
      path: '/login/:challenge?',
      name: 'login',
      component: LoginView
    },
    {
      path: '/reset',
      name: 'reset_request',
      component: ResetRequestView
    },
    {
      path: '/reset/:challenge',
      name: 'reset',
      component: ResetView
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
    },
    {
      path: '/docs',
      name: 'docs',
      component: DocsView
    }
  ]
})

router.beforeEach((to, from, next) => {
  if (to.path === "/logout") {
    remove_cookie("access_token");
    store.logged_in = false;
    router.go(0);
  }
  else if (get_cookie("access_token")) {
    store.update_logged_in().then(() => {
      if (!store.logged_in) {
        remove_cookie("access_token");
      }
      next()
    })
  } else {
    next()
  }

})

export default router
