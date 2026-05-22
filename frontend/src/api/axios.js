import axios from 'axios'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true,
})

// Attach token to outgoing requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('splitsmart_token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => Promise.reject(error)
)

// Silent token refresh on 401
api.interceptors.response.use(
  (res) => res,
  async (err) => {
    const original = err.config
    if (err.response?.status === 401 && !original._retry) {
      original._retry = true
      try {
        const res = await axios.post(
          `${import.meta.env.VITE_API_URL}/api/auth/refresh`,
          {},
          { withCredentials: true }
        )
        
        const newToken = res.data.accessToken
        localStorage.setItem('splitsmart_token', newToken)
        
        // Update the original request with the new token
        original.headers.Authorization = `Bearer ${newToken}`
        
        return api(original)
      } catch {
        localStorage.removeItem('splitsmart_token')
        const publicPaths = ['/login', '/register', '/'];
        if (!publicPaths.includes(window.location.pathname)) {
          window.location.href = '/login'
        }
      }
    }
    return Promise.reject(err)
  }
)

export default api
