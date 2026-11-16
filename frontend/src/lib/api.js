import axios from 'axios'

const api = axios.create({
  baseURL: 'http://localhost:3000/api',
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
})

export const getApiErrorMessage = (error, fallback) =>
  error.response?.data?.message || error.message || fallback

export default api
