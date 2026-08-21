import { createRouter, createWebHistory } from 'vue-router'

// 모든 View에 지연 로딩(Lazy Loading)을 적용해 초기 번들 크기를 줄인다.
const routes = [
  {
    path: '/',
    name: 'WeatherHome',
    component: () => import('../views/WeatherHomeView.vue'),
  },
  {
    path: '/weather/:cityId',
    name: 'WeatherDetail',
    component: () => import('../views/WeatherDetailView.vue'),
  },
  {
    path: '/about',
    name: 'WeatherAbout',
    component: () => import('../views/WeatherAboutView.vue'),
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    component: () => import('../views/NotFoundView.vue'),
  },
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
})

export default router
