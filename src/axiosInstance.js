import axios from 'axios'

function getCsrfToken() {
  const name = 'csrftoken'
  const cookies = document.cookie.split(';')
  for (let cookie of cookies) {
    cookie = cookie.trim()
    if (cookie.startsWith(name + '=')) {
      return cookie.substring(name.length + 1)
    }
  }
  return null
}

const csrfToken = getCsrfToken()

const axiosInstance = axios.create({
  baseURL: 'http://localhost:8000', // Hna Dir Api ta3ek
  headers: {
    'X-CSRFToken': csrfToken,
  },
})

export default axiosInstance
