import { createApp } from 'vue';
import { createPinia } from 'pinia';
import { createRouter, createWebHistory } from 'vue-router';
import App from './App.vue';
import './style.css'; 
import '@/lib/firebase';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    { path: '/', name: 'Home', component: () => import('./views/HomeView.vue') },
    { path: '/login', name: 'Login', component: () => import('./views/LoginView.vue') },
    { path: '/register', name: 'Register', component: () => import('./views/RegisterView.vue') },
    { path: '/edit/:id', name: 'Edit', component: () => import('./views/EditView.vue') },
    { path: '/404', name: 'NotFound', component: () => import('./views/NotFoundView.vue') },
    { path: '/error', name: 'Error', component: () => import('./views/Error.vue') },
    { path: '/:pathMatch(.*)*', redirect: '/404' },
  ],
});

const pinia = createPinia();

const vueApp = createApp(App);
vueApp.use(pinia);
vueApp.use(router);
vueApp.mount('#app');