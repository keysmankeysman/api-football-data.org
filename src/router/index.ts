import { createRouter, createWebHistory } from 'vue-router'
import Login from '../views/Login.vue'
import Leagues from '../views/Leagues.vue'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/login',
      name: 'Login',
      component: Login,
      meta: { requiresAuth: false }
    },
    {
      path: '/',
      name: 'Home',
      redirect: '/leagues'
    },
    {
      path: '/leagues',
      name: 'Leagues',
      component: Leagues,
      meta: { requiresAuth: true }
    },
    {
      path: '/leagues/:id',
      name: 'LeagueDetail',
      component: () => import('../views/LeagueDetail.vue'),
      meta: { requiresAuth: true }
    }
  ]
})

router.beforeEach((to, from, next) => {
  const token = localStorage.getItem('jwt_token')

  if (to.meta.requiresAuth && !token) {
    next('/login')
  } else if (to.path === '/login' && token) {
    next('/leagues')
  } else {
    next()
  }
})

export default router