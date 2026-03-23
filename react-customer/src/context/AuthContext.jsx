import { createContext, useContext, useState, useEffect } from 'react'
import { authAPI } from '../api'
const Ctx = createContext(null)
export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  useEffect(() => {
    const t = localStorage.getItem('at_token')
    const s = localStorage.getItem('at_user')
    if (t && s) {
      setUser(JSON.parse(s))
      authAPI.me().then(r => { setUser(r.data); localStorage.setItem('at_user', JSON.stringify(r.data)) }).catch(() => { localStorage.removeItem('at_token'); localStorage.removeItem('at_user'); setUser(null) }).finally(() => setLoading(false))
    } else setLoading(false)
  }, [])
  const login = async (email, password) => { const { data } = await authAPI.login({ email, password }); localStorage.setItem('at_token', data.token); localStorage.setItem('at_user', JSON.stringify(data.user)); setUser(data.user); return data.user }
  const register = async form => { const { data } = await authAPI.register(form); localStorage.setItem('at_token', data.token); localStorage.setItem('at_user', JSON.stringify(data.user)); setUser(data.user); return data.user }
  const logout = () => { localStorage.removeItem('at_token'); localStorage.removeItem('at_user'); setUser(null) }
  const updateUser = u => { setUser(u); localStorage.setItem('at_user', JSON.stringify(u)) }
  return <Ctx.Provider value={{ user, loading, login, register, logout, updateUser }}>{children}</Ctx.Provider>
}
export const useAuth = () => useContext(Ctx)
