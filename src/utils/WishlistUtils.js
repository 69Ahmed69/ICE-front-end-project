import axios from 'axios'

export function addToWishlist(courseId, userStore, toast) {
  if (!userStore.user.wishlist.includes(courseId)) {
    userStore.user.wishlist.push(courseId)

    axios
      .patch(`/api/users/${userStore.user.id}`, {
        wishlist: userStore.user.wishlist,
      })
      .then(() => {
        toast.clear()
        toast.success('Course wishlisted successfully!')
      })
      .catch((error) => {
        console.error('Error updating wishlist: ', error)
        toast.error('Failed to update wishlist. Please try again.')
      })
  } else {
    toast.info('This course is already in your cart.')
  }
}

export function removeFromWishlist(courseId, userStore, toast) {
  const index = userStore.user.wishlist.indexOf(courseId)
  if (index > -1) {
    userStore.user.wishlist.splice(index, 1)

    axios
      .patch(`/api/users/${userStore.user.id}`, {
        wishlist: userStore.user.wishlist,
      })
      .then(() => {
        toast.clear()
        toast.success('Course removed from your wishlist successfully!')
      })
      .catch((error) => {
        console.error('Error updating wishlist: ', error)
        toast.error('Failed to update wishlist. Please try again.')
      })
  } else {
    toast.info('This course is not in your wishlist.')
  }
}

export function isInWishlist(courseId, userStore) {
  return userStore.user.wishlist.includes(courseId)
}
