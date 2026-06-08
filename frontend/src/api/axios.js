import axios from 'axios'
import { getAccessToken, setAccessToken } from './tokenStore.js'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true,
})

// Attach token to outgoing requests
api.interceptors.request.use(
  (config) => {
    const token = getAccessToken();
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
        
        const newToken = res.data.accessToken;
        setAccessToken(newToken);
        
        // Update the original request with the new token
        original.headers.Authorization = `Bearer ${newToken}`
        
        return api(original)
      } catch {
        setAccessToken(null);
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
