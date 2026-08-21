import { createRouter, createWebHistory } from 'vue-router'
import WeatherHomeview from '../views/WeatherHomeview.vue'

const routes = [
    {
      path: '/',
      name: 'WeatherHome',
      component: WeatherHomeview,
    },
    {
      path: '/about',
      name: 'WeatherAbout',
      component: () => import('../views/WeatherAboutview.vue'),
    },
    {
      path: '/weather/:cityId',
      name: 'WeatherDetail',
      component: () => import('../views/WeatherDetailview.vue'),
    },
    {
      path: '/:pathMatch(.*)*',
      name: 'NotFound',
      component: () => import('../views/NotFoundview.vue'),
    },
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
})

export default router
