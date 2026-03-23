import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import toast from 'react-hot-toast'

export default function Register() {
  const { register } = useAuth()
  const navigate = useNavigate()
  const [form, setForm] = useState({ name:'', email:'', phone:'', password:'', confirm:'' })
  const [loading, setLoading] = useState(false)
  const f = k => e => setForm({...form,[k]:e.target.value})

  const handleSubmit = async e => {
    e.preventDefault()
    if (form.password !== form.confirm) return toast.error('Passwords do not match')
    if (form.password.length < 6) return toast.error('Password must be at least 6 characters')
    setLoading(true)
    try {
      await register({ name:form.name, email:form.email, phone:form.phone, password:form.password })
      toast.success('Welcome to AutoTechnix!')
      navigate('/')
    } catch (err) {
      toast.error(err.response?.data?.message || 'Registration failed')
    } finally { setLoading(false) }
  }

  return (
    <div style={{ minHeight:'calc(100vh - 58px)', display:'flex', alignItems:'center', justifyContent:'center', padding:40, background:'#050608' }}>
      <div style={{ background:'linear-gradient(160deg,#0e0f14,#0a0b0e)', border:'1px solid #1e2028', borderRadius:14, padding:36, width:'100%', maxWidth:400, position:'relative', overflow:'hidden' }}>
        <div style={{ position:'absolute', top:0, left:0, right:0, height:2, background:'#e8390e' }} />
        <div style={{ fontFamily:"'Orbitron',monospace", fontSize:12, fontWeight:900, color:'#e8390e', letterSpacing:'.14em', marginBottom:20 }}>⚙ AUTOTECHNIX</div>
        <h1 style={{ fontFamily:"'Orbitron',monospace", fontSize:20, fontWeight:900, letterSpacing:'.06em', marginBottom:4 }}>CREATE ACCOUNT</h1>
        <p style={{ fontSize:11, color:'#33333f', marginBottom:24 }}>Join AutoTechnix today</p>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Full Name</label>
            <input className="form-input" placeholder="John Smith" value={form.name} onChange={f('name')} required />
          </div>
          <div className="form-group">
            <label className="form-label">Email</label>
            <input className="form-input" type="email" placeholder="you@email.com" value={form.email} onChange={f('email')} required />
          </div>
          <div className="form-group">
            <label className="form-label">Phone</label>
            <input className="form-input" type="tel" placeholder="+1 234 567 8900" value={form.phone} onChange={f('phone')} />
          </div>
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:12 }}>
            <div className="form-group">
              <label className="form-label">Password</label>
              <input className="form-input" type="password" placeholder="••••••••" value={form.password} onChange={f('password')} required />
            </div>
            <div className="form-group">
              <label className="form-label">Confirm</label>
              <input className="form-input" type="password" placeholder="••••••••" value={form.confirm} onChange={f('confirm')} required />
            </div>
          </div>
          <button type="submit" className="btn btn-primary" style={{ width:'100%', justifyContent:'center', marginTop:8, padding:11 }} disabled={loading}>
            {loading ? 'Creating...' : 'CREATE ACCOUNT'}
          </button>
        </form>
        <p style={{ textAlign:'center', marginTop:16, fontSize:11, color:'#33333f' }}>
          Already have an account? <Link to="/login" style={{ color:'#e8390e', fontWeight:700 }}>Sign in</Link>
        </p>
      </div>
    </div>
  )
}
