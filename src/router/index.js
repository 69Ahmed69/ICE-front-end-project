import { createRouter, createWebHistory } from 'vue-router'
import { useRouter } from 'vue-router'
import HomeView from '@/views/HomeView.vue'
import CoursesView from '@/views/CoursesView.vue'
import CourseView from '@/views/CourseView.vue'
import NotFoundView from '@/views/NotFoundView.vue'
import CourseCategoryView from '@/views/CourseCategoryView.vue'
import InstructorView from '@/views/InstructorView.vue'
import SignInView from '@/views/SignInView.vue'
import SignUpView from '@/views/SignUpView.vue'
import BecomeInstructorView from '@/views/BecomeInstructorView.vue'
import UserProfileView from '@/views/UserProfileView.vue'
import WatchCourseView from '@/views/WatchCourseView.vue'
import ShoppingCartView from '@/views/ShoppingCartView.vue'
import CheckOutView from '@/views/CheckOutView.vue'
import { useUserStore } from '@/stores/user'
import { useToast } from 'vue-toastification'
import axios from 'axios'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
    },
    {
      path: '/profile',
      name: 'profile',
      component: UserProfileView,
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
      path: '/watch-course/:id',
      name: 'watchCourse',
      component: WatchCourseView,
    },
    {
      path: '/shopping-cart/',
      name: 'shoppingCart',
      component: ShoppingCartView,
    },
    {
      path: '/check-out/',
      name: 'checkOut',
      component: CheckOutView,
    },
    {
      path: '/instructor/:id',
      name: 'instructor',
      component: InstructorView,
    },
    {
      path: '/become-an-instructor',
      name: 'becomeAnInstructor',
      component: BecomeInstructorView,
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

router.beforeEach(async (to, from, next) => {
  const userStore = useUserStore()
  const toast = useToast()

  // Verify token if the user is not signed in
  if (!userStore.isSignedIn) {
    await verifyToken()
  }

  // Route-specific checks
  if ((to.name === 'sign-in' || to.name === 'sign-up') && userStore.isSignedIn) {
    return next('/') // Redirect signed-in users away from sign-in or sign-up
  }

  if (to.name === 'profile' && !userStore.isSignedIn) {
    toast.error('Please sign in to access your profile.')
    return next('/') // Redirect non-signed-in users away from the profile page
  }

  if (to.name === 'shoppingCart' && !userStore.isSignedIn) {
    toast.error('Please sign-in to access your shopping cart.')
    return next('/')
  }

  if (to.name === 'checkOut') {
    if (!userStore.isSignedIn) {
      toast.error('You have to be logged-in to buy a course.')
      return next('/')
    } else {
      if (localStorage.getItem('cameFromCart') !== 'true') {
        // Redirect to cart if the user didn't come from there
        return next('/shopping-cart/')
      }
    }
  }

  if (to.name === 'watch-course') {
    const courseId = to.params.id

    let ownsCourse = false
    for (const course of userStore.user.ownedCourses) {
      if (courseId == course.courseId) {
        ownsCourse = true
        return
      }
    }

    if (!ownsCourse) {
      return next(`/course/${courseId}`) // Redirect to the course page
    }
  }

  next() // Allow navigation
})

const getCookie = (name) => {
  const cookies = document.cookie.split('; ')
  const cookie = cookies.find((cookie) => cookie.startsWith(`${name}=`))
  return cookie ? cookie.split('=')[1] : null
}

const verifyToken = async () => {
  const userStore = useUserStore()
  const toast = useToast()
  const router = useRouter()
  const token = getCookie('ice-token')
  const username = getCookie('username')
  if (!token) {
    userStore.signOut()
    userStore.removeInstructor()
    return
  }

  try {
    const response = await axios.get(`/api/users?userName=${username}`)

    if (response.data.length === 1) {
      const user = response.data[0]
      const isTokenValid = Date.now() < new Date(user.authentication.expires).getTime()
      if (isTokenValid) {
        userStore.signIn(user)
        if (user.isInstructor) {
          userStore.makeInstructor()
        } else {
          userStore.removeInstructor()
        }
      } else {
        console.warn('Token has expired')
        await axios.patch(`/api/users/${user.id}`, {
          authentication: {
            token: null,
            expires: null,
          },
        })
        userStore.signOut()
        userStore.removeInstructor()
        router.push('/')
        toast.error('Your session has expired.')
      }
    } else {
      console.warn('Invalid token')
      userStore.signOut()
      userStore.removeInstructor()
      router.push('/')
      toast.error('Invalid session token.')
    }
  } catch (error) {
    console.error('Token verification error:', error)
    userStore.signOut()
    userStore.removeInstructor()
    router.push('/')
    toast.error('Token verification error.')
  }
}

export default router
