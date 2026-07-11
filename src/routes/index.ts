import { createRouter, createWebHistory } from 'vue-router'

import Login from '@/views/Login.vue'
import Home from '@/views/Home.vue'
import Quiz from '@/views/Quiz.vue'

import MainLayout from '@/layouts/MainLayout.vue'
import Quizzes from '@/views/Quizzes.vue'
import Settings from '@/views/Settings.vue'
import Users from '@/views/Users.vue'
import UserResult from '@/views/UserResult.vue'
import Profile from '@/views/Profile.vue'

const routes = [
  // Public route
  {
    path: '/',
    component: Login,
  },

  // Protected/Layout routes
  {
    path: '/',
    component: MainLayout,

    children: [
      {
        path: 'home',
        component: Home,
      },
      {
        path: 'quizzes',
        component:  Quizzes,
      },
      {
        path: 'settings',
        component: Settings,
      },
      {
        path: 'users',
        component: Users,
      },
      {
        path: 'user-results',
        component: UserResult,
      },
      {
        path: 'profile',
        component: Profile,
      },
      {
        path: 'quiz/:id',
        name: 'Quiz',
        component: Quiz,
        props: true,
      },
    ],
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router