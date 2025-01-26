import { createRouter, createWebHistory } from 'vue-router'
import { useRouter } from 'vue-router'
import HomeView from '@/views/HomeView.vue'
import CoursesView from '@/views/CoursesView.vue'
import CourseView from '@/views/CourseView.vue'
import NotFoundView from '@/views/NotFoundView.vue'
import CategoryView from '@/views/CategoryView.vue'
import InstructorView from '@/views/InstructorView.vue'
import SignInView from '@/views/SignInView.vue'
import SignUpView from '@/views/SignUpView.vue'
import BecomeInstructorView from '@/views/BecomeInstructorView.vue'
import UserProfileView from '@/views/UserProfileView.vue'
import WatchCourseView from '@/views/WatchCourseView.vue'
import ShoppingCartView from '@/views/ShoppingCartView.vue'
import CheckOutView from '@/views/CheckOutView.vue'
import Request from '@/views/RequestView.vue'
import AdminView from '@/views/AdminView.vue'
import ForumView from '@/views/ForumView.vue'
import QuestionView from '@/views/QuestionView.vue'
import { useUserStore } from '@/stores/user'
import { useToast } from 'vue-toastification'
import dayjs from 'dayjs'
import axios from 'axios'

const DAYS_TO_RETRY = 30

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  scrollBehavior(to, from, savedPosition) {
    return { top: 0 }
  },
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
    },
    {
      path: '/admin',
      name: 'admin',
      component: AdminView,
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
      path: '/category/:categoryId',
      name: 'Category',
      component: CategoryView,
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
      path: '/become-an-instructor/request',
      name: 'request',
      component: Request,
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
      path: '/forum',
      name: 'forum',
      component: ForumView,
    },
    {
      path: '/question',
      name: 'question',
      component: QuestionView,
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

  if (to.name === 'request') {
    if (!userStore.isSignedIn) {
      toast.error('You have to be logged in to submit a request.')
      return next('/')
    }

    if (userStore.isInstuctor) {
      toast.error("You can't submit a request. You're already an instructor.")
      return next('/')
    }

    const request = await checkRequest(userStore)

    if (request) {
      if (request.status === 'Pending') {
        toast.info('Your request is still under review.')
        return next('/')
      }

      if (request.status === 'Rejected') {
        const now = dayjs()
        const diffDays = now.diff(request.submitted, 'day')

        if (diffDays < DAYS_TO_RETRY) {
          toast.info(
            `Your request was rejected. Please try again in ${DAYS_TO_RETRY - diffDays} days.`,
          )
          return next('/')
        }
      }
      return next('/')
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

const checkRequest = async (userStore) => {
  try {
    const response = await axios.get(`/api/requests/${userStore.user.id}`, {
      validateStatus: (status) => status < 500, // Resolve for all statuses < 500
    })

    if (response.status === 404) {
      return null // Handle 404 explicitly
    }

    return response.data // Return data for other successful responses
  } catch (error) {
    console.error('An unexpected error occurred:', error) // Log unexpected errors
    return null
  }
}

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
