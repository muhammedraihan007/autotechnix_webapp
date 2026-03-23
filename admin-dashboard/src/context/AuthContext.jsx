import { createContext, useContext, useState, useEffect } from 'react'
import { authAPI } from '../api'
const Ctx = createContext(null)
export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  useEffect(() => {
    const t = localStorage.getItem('admin_token')
    const s = localStorage.getItem('admin_user')
    if (t && s) {
      setUser(JSON.parse(s))
      authAPI.me().then(r => { if (r.data.role !== 'admin') logout(); else { setUser(r.data); localStorage.setItem('admin_user', JSON.stringify(r.data)) } }).catch(() => logout()).finally(() => setLoading(false))
    } else setLoading(false)
  }, [])
  const login = async (email, password) => {
    const { data } = await authAPI.login({ email, password })
    if (data.user.role !== 'admin') throw new Error('Admin access only')
    localStorage.setItem('admin_token', data.token)
    localStorage.setItem('admin_user', JSON.stringify(data.user))
    setUser(data.user); return data.user
  }
  const logout = () => { localStorage.removeItem('admin_token'); localStorage.removeItem('admin_user'); setUser(null) }
  return <Ctx.Provider value={{ user, loading, login, logout }}>{children}</Ctx.Provider>
}
export const useAuth = () => useContext(Ctx)
