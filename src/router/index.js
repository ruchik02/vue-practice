import { createRouter, createWebHistory } from "vue-router";
// import HomeView from '@/views/HomeView.vue';
// import AboutView from '@/views/AboutView.vue';
// import ContactView from '@/views/ContactView.vue';
// import IntroView from '@/views/IntroView.vue';
import Login from "@/views/Login.vue";
import Signup from "@/views/Signup.vue";
import Dashboard from "@/views/Dashboard.vue";
import { auth } from "@/firebaseConfig";

const routes = [
  // { path: '/', component: HomeView },
  // { path: '/about', component: AboutView },
  // {path: '/contact', component: ContactView},
  // {path: '/intro', component: IntroView}
  { path: "/", component: Login },
  { path: "/signup", component: Signup },
  {
    path: "/dashboard",
    component: Dashboard,
    meta: { requiresAuth: true }, // Protect Route
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach((to, from, next) => {
    if (to.meta.requiresAuth && !auth.currentUser) {
      next("/");
    } else {
      next();
    }
  });

export default router;
