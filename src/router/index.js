import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '@/views/HomeView.vue'
import CoursesView from '@/views/CoursesView.vue'
import CourseView from '@/views/CourseView.vue'
import NotFoundView from '@/views/NotFoundView.vue'
import CourseCategoryView from '@/views/CourseCategoryView.vue'
import InstructorView from '@/views/InstructorView.vue'
import SignInView from '@/views/SignInView.vue'
import SignUpView from '@/views/SignUpView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
    },
    {
      path: '/courses/',
      name: 'courses',
      component: CoursesView,
    },
    {
      path: '/courses/:category/:subCategory?',
      name: 'CourseCategory',
      component: CourseCategoryView,
    },
    {
      path: '/course/:id',
      name: 'course',
      component: CourseView,
    },
    {
      path: '/instructor/:id',
      name: 'instructor',
      component: InstructorView,
    },
    {
      path: '/sign-in',
      name: 'sign-in',
      component: SignInView,
    },
    {
      path: '/sign-up',
      name: 'sign-up',
      component: SignUpView,
    },
    {
      path: '/404',
      name: 'NotFound',
      component: NotFoundView,
    },
    {
      path: '/:pathMatch(.*)*',
      redirect: '/404',
    },
  ],
})

export default router
