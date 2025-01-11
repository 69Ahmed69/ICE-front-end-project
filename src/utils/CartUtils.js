import axios from 'axios'

export function addToCart(courseId, userStore, toast) {
  if (!userStore.user.shoppingCart.includes(courseId)) {
    userStore.user.shoppingCart.push(courseId)

    axios
      .patch(`/api/users/${userStore.user.id}`, {
        shoppingCart: userStore.user.shoppingCart,
      })
      .then(() => {
        toast.clear()

        toast.success('Course added to your cart successfully!')
      })
      .catch((error) => {
        console.error('Error updating shopping cart: ', error)
        toast.error('Failed to update shopping cart. Please try again.')
      })
  } else {
    toast.clear()

    toast.info('This course is already in your cart.')
  }
}

export function removeFromCart(courseId, userStore, toast) {
  const index = userStore.user.shoppingCart.indexOf(courseId)
  if (index > -1) {
    userStore.user.shoppingCart.splice(index, 1)

    axios
      .patch(`/api/users/${userStore.user.id}`, {
        shoppingCart: userStore.user.shoppingCart,
      })
      .then(() => {
        toast.clear()
        toast.success('Course removed from your cart successfully!')
      })
      .catch((error) => {
        console.error('Error updating shopping cart: ', error)
        toast.error('Failed to update shopping cart. Please try again.')
      })
  } else {
    toast.clear()
    toast.info('This course is not in your cart.')
  }
}

export function emptyCart(userStore) {
  userStore.user.shoppingCart = []
  axios
    .patch(`/api/users/${userStore.user.id}`, {
      shoppingCart: [],
    })
    .catch((error) => {
      console.error('Error updating shopping cart: ', error)
    })
}

export function isInCart(courseId, userStore) {
  return userStore.user.shoppingCart.includes(courseId)
}
