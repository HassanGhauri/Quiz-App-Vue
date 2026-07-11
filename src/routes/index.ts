import { createRouter, createWebHistory } from 'vue-router'

import Login from '@/views/Login.vue'
import Home from '@/views/Home.vue'
import Quiz from '@/views/Quiz.vue'

const routes = [
  {
    path: '/',
    component: Login,
  },
  {
    path: '/home',
    component: Home,
  },
  {
    path: '/quiz/:id',
    name: 'Quiz',
    component: Quiz,
    props: true,
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router