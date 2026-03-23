import { useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { authAPI } from '../api'
import toast from 'react-hot-toast'

export default function Profile() {
  const { user, updateUser } = useAuth()
  const [form, setForm] = useState({ name:user?.name||'', phone:user?.phone||'' })
  const [saving, setSaving] = useState(false)

  const handleSave = async e => {
    e.preventDefault(); setSaving(true)
    try {
      const { data } = await authAPI.updateProfile(form)
      updateUser({...user,...data})
      toast.success('Profile updated!')
    } catch (err) { toast.error(err.response?.data?.message || 'Update failed') }
    finally { setSaving(false) }
  }

  const box = { background:'linear-gradient(160deg,#0e0f14,#0a0b0e)', border:'1px solid #1e2028', borderRadius:10, padding:24, position:'relative', overflow:'hidden' }

  return (
    <div style={{ padding:24, background:'#050608', minHeight:'calc(100vh - 58px)' }}>
      <div style={{ maxWidth:600, margin:'0 auto' }}>
        <div style={{ fontFamily:"'Orbitron',monospace", fontSize:18, fontWeight:900, color:'#c0c0d0', letterSpacing:'.06em', marginBottom:4 }}>MY PROFILE</div>
        <div style={{ fontSize:11, color:'#33333f', marginBottom:20 }}>Manage your account information</div>

        <div style={{ ...box, marginBottom:16, display:'flex', alignItems:'center', gap:18 }}>
          <div style={{ position:'absolute', top:0, left:0, right:0, height:2, background:'#e8390e' }}/>
          <div style={{ width:60, height:60, borderRadius:'50%', background:'radial-gradient(circle at 40% 35%,#2a2a36,#0f0f14)', border:'2px solid #e8390e', display:'flex', alignItems:'center', justifyContent:'center', fontFamily:"'Orbitron',monospace", fontSize:22, fontWeight:900, color:'#e8390e', flexShrink:0 }}>
            {user?.name?.[0]?.toUpperCase()}
          </div>
          <div>
            <div style={{ fontFamily:"'Rajdhani',sans-serif", fontSize:18, fontWeight:700, color:'#c0c0d0' }}>{user?.name}</div>
            <div style={{ fontSize:12, color:'#33333f', marginTop:2 }}>{user?.email}</div>
            <span className={`badge badge-${user?.role==='admin'?'confirmed':'completed'}`} style={{ marginTop:6 }}>{user?.role}</span>
          </div>
        </div>

        <form onSubmit={handleSave} style={box}>
          <div style={{ position:'absolute', top:0, left:0, right:0, height:2, background:'#1e2028' }}/>
          <div style={{ fontFamily:"'Orbitron',monospace", fontSize:10, fontWeight:900, color:'#2a2a36', letterSpacing:'.12em', marginBottom:18 }}>EDIT INFORMATION</div>
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:14 }}>
            <div className="form-group" style={{ marginBottom:0 }}>
              <label className="form-label">Full Name</label>
              <input className="form-input" value={form.name} onChange={e=>setForm({...form,name:e.target.value})} required />
            </div>
            <div className="form-group" style={{ marginBottom:0 }}>
              <label className="form-label">Email (read only)</label>
              <input className="form-input" value={user?.email} disabled style={{ opacity:.4 }} />
            </div>
            <div className="form-group" style={{ marginBottom:0 }}>
              <label className="form-label">Phone Number</label>
              <input className="form-input" type="tel" value={form.phone} onChange={e=>setForm({...form,phone:e.target.value})} placeholder="+1 234 567 8900" />
            </div>
          </div>
          <button type="submit" className="btn btn-primary" style={{ marginTop:20 }} disabled={saving}>
            {saving?'SAVING...':'SAVE CHANGES'}
          </button>
        </form>
      </div>
    </div>
  )
}
