import { createRouter, createWebHistory } from "vue-router";
// import HomeView from '@/views/HomeView.vue';
// import AboutView from '@/views/AboutView.vue';
// import ContactView from '@/views/ContactView.vue';
// import IntroView from '@/views/IntroView.vue';
import Login from "@/views/Login.vue";
import Signup from "@/views/Signup.vue";
import Dashboard from "@/views/Dashboard.vue";
import { auth } from "@/firebaseConfig";
import Profile from "@/views/Profile.vue";
import Message from "@/views/Message.vue";
import Help from "@/views/Help.vue";
import AboutUs from "@/views/AboutUs.vue";
import Setting from "@/views/Setting.vue";
import Notification from "@/views/Notification.vue";
import Home from "@/views/Home.vue";

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
    redirect: "/dashboard/home",
    meta: { requiresAuth: true }, // Protect Route
    children: [
        { path: "home", component: Home },
        { path: "profile", component: Profile },
        { path: "messages", component: Message },
        { path: "notifications", component: Notification },
        { path: "help", component: Help },
        { path: "about", component: AboutUs },
        { path: "settings", component: Setting },
      ],
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
