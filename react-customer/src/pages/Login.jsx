import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import toast from 'react-hot-toast'

export default function Login() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const [form, setForm] = useState({ email: '', password: '' })
  const [loading, setLoading] = useState(false)

  const handleSubmit = async e => {
    e.preventDefault()
    setLoading(true)
    try {
      const user = await login(form.email, form.password)
      toast.success('Welcome back ' + user.name.split(' ')[0] + '!')
      navigate('/')
    } catch (err) {
      toast.error(err.response?.data?.message || 'Login failed')
    } finally { setLoading(false) }
  }

  return (
    <div style={{ minHeight:'calc(100vh - 58px)', display:'flex', alignItems:'center', justifyContent:'center', padding:40, background:'#050608' }}>
      <div style={{ background:'linear-gradient(160deg,#0e0f14,#0a0b0e)', border:'1px solid #1e2028', borderRadius:14, padding:36, width:'100%', maxWidth:340, position:'relative', overflow:'hidden' }}>
        <div style={{ position:'absolute', top:0, left:0, right:0, height:2, background:'#e8390e' }} />
        <div style={{ fontFamily:"'Orbitron',monospace", fontSize:12, fontWeight:900, color:'#e8390e', letterSpacing:'.14em', marginBottom:20 }}>⚙ AUTOTECHNIX</div>
        <h1 style={{ fontFamily:"'Orbitron',monospace", fontSize:20, fontWeight:900, letterSpacing:'.06em', marginBottom:4 }}>SIGN IN</h1>
        <p style={{ fontSize:11, color:'#33333f', marginBottom:24 }}>Access your workshop portal</p>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Email</label>
            <input className="form-input" type="email" placeholder="you@email.com" value={form.email} onChange={e=>setForm({...form,email:e.target.value})} required />
          </div>
          <div className="form-group">
            <label className="form-label">Password</label>
            <input className="form-input" type="password" placeholder="••••••••" value={form.password} onChange={e=>setForm({...form,password:e.target.value})} required />
          </div>
          <button type="submit" className="btn btn-primary" style={{ width:'100%', justifyContent:'center', marginTop:8, padding:11 }} disabled={loading}>
            {loading ? 'Signing in...' : 'SIGN IN'}
          </button>
        </form>
        <p style={{ textAlign:'center', marginTop:16, fontSize:11, color:'#33333f' }}>
          No account? <Link to="/register" style={{ color:'#e8390e', fontWeight:700 }}>Register</Link>
        </p>
      </div>
    </div>
  )
}
