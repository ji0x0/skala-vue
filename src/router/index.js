import { createRouter, createWebHistory } from 'vue-router'

/**
 * 모든 View에 지연 로딩(Lazy Loading)을 적용해 화면 단위로 코드를 분할한다.
 * 마지막 Catch-all 라우트가 정의되지 않은 주소를 404 화면으로 보낸다.
 */
const routes = [
  {
    path: '/',
    name: 'WeatherHome',
    component: () => import('../views/WeatherHomeView.vue'),
    meta: { title: '운영 브리핑' },
  },
  {
    path: '/weather/:cityId',
    name: 'WeatherDetail',
    component: () => import('../views/WeatherDetailView.vue'),
    meta: { title: '사업장 기상 상세' },
  },
  {
    path: '/solar/:region',
    name: 'SolarDetail',
    component: () => import('../views/SolarDetailView.vue'),
    meta: { title: '태양광 발전 상세' },
  },
  {
    path: '/about',
    name: 'WeatherAbout',
    component: () => import('../views/WeatherAboutView.vue'),
    meta: { title: '서비스 소개' },
  },
  {
    path: '/labs',
    name: 'LabArchive',
    component: () => import('../views/LabArchiveView.vue'),
    meta: { title: '실습 아카이브' },
  },
  {
    path: '/labs/:step',
    name: 'LabDetail',
    component: () => import('../views/LabDetailView.vue'),
    meta: { title: '실습 상세' },
  },
  {
    path: '/troubleshooting',
    name: 'Troubleshooting',
    component: () => import('../views/TroubleshootingView.vue'),
    meta: { title: '트러블슈팅' },
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    component: () => import('../views/NotFoundView.vue'),
    meta: { title: '페이지 없음' },
  },
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
  scrollBehavior: () => ({ top: 0 }),
})

/** 홈에서 쓰는 정식 명칭 */
const SERVICE_TITLE = '제조현장 데일리 운영 브리핑'

router.afterEach((to) => {
  // 홈은 서비스명을, 나머지 화면은 화면 이름만 탭에 표시한다.
  document.title =
    to.name === 'WeatherHome' || !to.meta.title ? SERVICE_TITLE : to.meta.title
})

export default router
