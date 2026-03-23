import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import toast from 'react-hot-toast'

export default function Login() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const [form, setForm] = useState({ email:'', password:'' })
  const [loading, setLoading] = useState(false)

  const handleSubmit = async e => {
    e.preventDefault(); setLoading(true)
    try { await login(form.email, form.password); toast.success('Welcome back!'); navigate('/') }
    catch (err) { toast.error(err.response?.data?.message || err.message || 'Login failed') }
    finally { setLoading(false) }
  }

  return (
    <div style={{ minHeight:'100vh', display:'flex', alignItems:'center', justifyContent:'center', padding:40, background:'#050608' }}>
      <div style={{ background:'linear-gradient(160deg,#0e0f14,#0a0b0e)', border:'1px solid #1e2028', borderRadius:14, padding:36, width:'100%', maxWidth:360, position:'relative', overflow:'hidden' }}>
        <div style={{ position:'absolute', top:0, left:0, right:0, height:2, background:'#e8390e' }}/>
        <div style={{ fontFamily:"'Orbitron',monospace", fontSize:12, fontWeight:900, color:'#e8390e', letterSpacing:'.14em', marginBottom:20 }}>⚙ AUTOTECHNIX</div>
        <div style={{ background:'rgba(232,57,14,.08)', border:'1px solid rgba(232,57,14,.2)', borderRadius:20, padding:'3px 12px', display:'inline-block', fontFamily:"'Orbitron',monospace", fontSize:9, color:'#e8390e', letterSpacing:'.1em', marginBottom:20 }}>ADMIN PANEL</div>
        <h1 style={{ fontFamily:"'Orbitron',monospace", fontSize:20, fontWeight:900, letterSpacing:'.06em', marginBottom:4 }}>SIGN IN</h1>
        <p style={{ fontSize:11, color:'#33333f', marginBottom:24 }}>Administrator access only</p>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Email</label>
            <input className="form-input" type="email" placeholder="admin@autotechnix.com" value={form.email} onChange={e=>setForm({...form,email:e.target.value})} required />
          </div>
          <div className="form-group">
            <label className="form-label">Password</label>
            <input className="form-input" type="password" placeholder="••••••••" value={form.password} onChange={e=>setForm({...form,password:e.target.value})} required />
          </div>
          <button type="submit" className="btn btn-primary" style={{ width:'100%', justifyContent:'center', padding:11, marginTop:8 }} disabled={loading}>
            {loading ? 'SIGNING IN...' : 'SIGN IN'}
          </button>
        </form>
        <p style={{ textAlign:'center', marginTop:14, fontFamily:"'Orbitron',monospace", fontSize:8, color:'#1e1e28', letterSpacing:'.1em' }}>
          DEFAULT: admin@autotechnix.com / Admin@123
        </p>
      </div>
    </div>
  )
}
