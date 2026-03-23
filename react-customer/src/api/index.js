import axios from 'axios'
const BASE = 'https://opulent-space-broccoli-gr446xj555ghw7xq-5000.app.github.dev/api'
const api = axios.create({ baseURL: BASE })
api.interceptors.request.use(c => { const t = localStorage.getItem('at_token'); if (t) c.headers.Authorization = 'Bearer ' + t; return c })
api.interceptors.response.use(r => r, e => { if (e.response?.status === 401) { localStorage.removeItem('at_token'); localStorage.removeItem('at_user'); window.location.href = '/login' } return Promise.reject(e) })
export default api
export const authAPI = { register: d => api.post('/auth/register', d), login: d => api.post('/auth/login', d), me: () => api.get('/auth/me'), updateProfile: d => api.put('/auth/profile', d) }
export const servicesAPI = { getAll: cat => api.get('/services', { params: cat ? { category: cat } : {} }) }
export const vehiclesAPI = { getAll: () => api.get('/vehicles'), create: d => api.post('/vehicles', d), update: (id, d) => api.put('/vehicles/' + id, d), remove: id => api.delete('/vehicles/' + id) }
export const bookingsAPI = { getAll: status => api.get('/bookings', { params: status ? { status } : {} }), getOne: id => api.get('/bookings/' + id), create: d => api.post('/bookings', d) }
export const invoicesAPI = { getAll: () => api.get('/invoices'), getOne: id => api.get('/invoices/' + id) }
