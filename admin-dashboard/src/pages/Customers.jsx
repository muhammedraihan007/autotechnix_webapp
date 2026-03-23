import { useEffect, useState } from 'react'
import { custAPI } from '../api'
import toast from 'react-hot-toast'

export default function Customers() {
  const [customers, setCustomers] = useState([])
  const [staff, setStaff] = useState([])
  const [loading, setLoading] = useState(true)
  const [tab, setTab] = useState('customers')
  const [showAddStaff, setShowAddStaff] = useState(false)
  const [staffForm, setStaffForm] = useState({ name:'', email:'', phone:'', password:'' })
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    Promise.all([custAPI.getAll(), custAPI.getStaff()])
      .then(([cr,sr])=>{ setCustomers(cr.data); setStaff(sr.data) })
      .finally(()=>setLoading(false))
  }, [])

  const handleAddStaff = async e => {
    e.preventDefault(); setSaving(true)
    try {
      const { data } = await custAPI.addStaff(staffForm)
      setStaff(p=>[...p,data]); setShowAddStaff(false)
      setStaffForm({ name:'', email:'', phone:'', password:'' })
      toast.success('Technician added')
    } catch (err) { toast.error(err.response?.data?.message || 'Error') }
    finally { setSaving(false) }
  }

  const list = tab==='customers' ? customers : staff
  const box = { background:'linear-gradient(160deg,#0e0f14,#0a0b0e)', border:'1px solid #1e2028', borderRadius:10, overflow:'hidden' }

  return (
    <div>
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:18 }}>
        <div>
          <div style={{ fontFamily:"'Orbitron',monospace", fontSize:18, fontWeight:900, color:'#c0c0d0', letterSpacing:'.06em' }}>USERS</div>
          <div style={{ fontSize:11, color:'#33333f', marginTop:3 }}>Manage customers and staff</div>
        </div>
        {tab==='staff' && <button className="btn btn-primary btn-sm" onClick={()=>setShowAddStaff(true)}>+ ADD TECHNICIAN</button>}
      </div>

      <div style={{ display:'flex', gap:6, marginBottom:18 }}>
        {['customers','staff'].map(t=>(
          <button key={t} onClick={()=>setTab(t)}
            style={{ background:tab===t?'#e8390e':'#0a0b0e', border:'1px solid', borderColor:tab===t?'#e8390e':'#1e2028', color:tab===t?'#fff':'#33333f', padding:'5px 16px', borderRadius:20, fontSize:10, fontWeight:700, cursor:'pointer', letterSpacing:'.06em', transition:'all .18s', fontFamily:"'Orbitron',monospace" }}>
            {t.toUpperCase()} ({t==='customers'?customers.length:staff.length})
          </button>
        ))}
      </div>

      {showAddStaff && tab==='staff' && (
        <form onSubmit={handleAddStaff} style={{ ...box, border:'1px solid #e8390e', padding:20, marginBottom:18, position:'relative' }}>
          <div style={{ position:'absolute', top:0, left:0, right:0, height:2, background:'#e8390e' }}/>
          <div style={{ fontFamily:"'Orbitron',monospace", fontSize:10, color:'#2a2a36', letterSpacing:'.12em', marginBottom:14 }}>ADD TECHNICIAN</div>
          <div style={{ display:'grid', gridTemplateColumns:'repeat(2,1fr)', gap:12 }}>
            {[['name','Full Name','Jane Smith'],['email','Email','jane@workshop.com'],['phone','Phone','+1 234 567'],['password','Password','Min 6 chars']].map(([k,l,p])=>(
              <div key={k} className="form-group" style={{ marginBottom:0 }}>
                <label className="form-label">{l}</label>
                <input className="form-input" type={k==='password'?'password':'text'} placeholder={p} value={staffForm[k]} onChange={e=>setStaffForm({...staffForm,[k]:e.target.value})} required/>
              </div>
            ))}
          </div>
          <div style={{ display:'flex', gap:8, marginTop:14 }}>
            <button type="submit" className="btn btn-primary btn-sm" disabled={saving}>{saving?'Adding...':'Add Technician'}</button>
            <button type="button" className="btn btn-ghost btn-sm" onClick={()=>setShowAddStaff(false)}>Cancel</button>
          </div>
        </form>
      )}

      {loading ? <div className="loading"><div className="spinner"/></div> : (
        <div style={box}>
          <table style={{ width:'100%', borderCollapse:'collapse', fontSize:12 }}>
            <thead>
              <tr>
                {['Name','Email','Phone','Role','Joined','Status'].map(h=>(
                  <th key={h} style={{ textAlign:'left', padding:'9px 14px', fontFamily:"'Orbitron',monospace", fontSize:8, fontWeight:700, letterSpacing:'.1em', color:'#1e1e28', borderBottom:'1px solid #1e2028', background:'#070809' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {list.length===0 ? (
                <tr><td colSpan={6} style={{ textAlign:'center', padding:40, color:'#33333f' }}>No {tab} found</td></tr>
              ) : list.map(u=>(
                <tr key={u._id} style={{ transition:'background .15s' }}
                  onMouseEnter={e=>e.currentTarget.style.background='#0a0b0e'}
                  onMouseLeave={e=>e.currentTarget.style.background='transparent'}>
                  <td style={{ padding:'11px 14px', borderBottom:'1px solid #0f1014', fontWeight:600, color:'#555568' }}>{u.name}</td>
                  <td style={{ padding:'11px 14px', borderBottom:'1px solid #0f1014', fontSize:11, color:'#33333f' }}>{u.email}</td>
                  <td style={{ padding:'11px 14px', borderBottom:'1px solid #0f1014', fontSize:11, color:'#2a2a36' }}>{u.phone||'—'}</td>
                  <td style={{ padding:'11px 14px', borderBottom:'1px solid #0f1014' }}><span className={`badge badge-${u.role}`}>{u.role}</span></td>
                  <td style={{ padding:'11px 14px', borderBottom:'1px solid #0f1014', fontFamily:"'Orbitron',monospace", fontSize:9, color:'#2a2a36' }}>{new Date(u.createdAt).toLocaleDateString()}</td>
                  <td style={{ padding:'11px 14px', borderBottom:'1px solid #0f1014' }}><span className={`badge ${u.isActive?'badge-completed':'badge-cancelled'}`}>{u.isActive?'Active':'Disabled'}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
