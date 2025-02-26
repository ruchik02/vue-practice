import { createRouter, createWebHistory } from 'vue-router';
import HomeView from '@/views/HomeView.vue';
import AboutView from '@/views/AboutView.vue';
import ContactView from '@/views/ContactView.vue';
import IntroView from '@/views/IntroView.vue';

const routes = [
    { path: '/', component: HomeView },
    { path: '/about', component: AboutView },
    {path: '/contact', component: ContactView},
    {path: '/intro', component: IntroView}
];

const router = createRouter({
    history: createWebHistory(),
    routes
  });

export default router;