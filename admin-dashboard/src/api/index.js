import axios from 'axios'
const BASE = 'https://opulent-space-broccoli-gr446xj555ghw7xq-5000.app.github.dev/api'
const api = axios.create({ baseURL: BASE })
api.interceptors.request.use(c => { const t = localStorage.getItem('admin_token'); if (t) c.headers.Authorization = 'Bearer ' + t; return c })
api.interceptors.response.use(r => r, e => { if (e.response?.status === 401) { localStorage.removeItem('admin_token'); localStorage.removeItem('admin_user'); window.location.href = '/login' } return Promise.reject(e) })
export default api
export const authAPI = { login: d => api.post('/auth/login', d), me: () => api.get('/auth/me') }
export const dashAPI = { stats: () => api.get('/dashboard/stats') }
export const bookAPI = { getAll: s => api.get('/bookings', { params: s ? { status: s } : {} }), getOne: id => api.get('/bookings/' + id), updateStatus: (id, d) => api.put('/bookings/' + id + '/status', d), update: (id, d) => api.put('/bookings/' + id, d) }
export const svcAPI = { getAll: () => api.get('/services/all'), create: d => api.post('/services', d), update: (id, d) => api.put('/services/' + id, d), remove: id => api.delete('/services/' + id) }
export const custAPI = { getAll: () => api.get('/customers'), getStaff: () => api.get('/customers/staff'), addStaff: d => api.post('/customers/technician', d), update: (id, d) => api.put('/customers/' + id, d) }
export const invAPI = { getAll: () => api.get('/invoices'), getOne: id => api.get('/invoices/' + id), create: d => api.post('/invoices', d), markPaid: id => api.put('/invoices/' + id + '/paid') }
