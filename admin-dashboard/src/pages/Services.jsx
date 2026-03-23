import { useEffect, useState } from 'react'
import { svcAPI } from '../api'
import toast from 'react-hot-toast'

const CATS = ['oil_change','tire','brake','engine','ac','electrical','body','inspection','other']
const blank = { name:'', description:'', category:'oil_change', basePrice:'', estimatedHours:'', isActive:true }

export default function Services() {
  const [services, setServices] = useState([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editing, setEditing] = useState(null)
  const [form, setForm] = useState(blank)
  const [saving, setSaving] = useState(false)

  useEffect(() => { svcAPI.getAll().then(r=>setServices(r.data)).finally(()=>setLoading(false)) }, [])

  const openAdd = () => { setEditing(null); setForm(blank); setShowForm(true) }
  const openEdit = s => { setEditing(s._id); setForm({ name:s.name, description:s.description, category:s.category, basePrice:s.basePrice, estimatedHours:s.estimatedHours, isActive:s.isActive }); setShowForm(true) }

  const handleSave = async e => {
    e.preventDefault(); setSaving(true)
    try {
      if (editing) {
        const { data } = await svcAPI.update(editing, form)
        setServices(p=>p.map(s=>s._id===editing?data:s))
        toast.success('Service updated')
      } else {
        const { data } = await svcAPI.create(form)
        setServices(p=>[...p,data])
        toast.success('Service created')
      }
      setShowForm(false)
    } catch (err) { toast.error(err.response?.data?.message || 'Error') }
    finally { setSaving(false) }
  }

  const handleDelete = async id => {
    if (!confirm('Deactivate this service?')) return
    try { await svcAPI.remove(id); setServices(p=>p.map(s=>s._id===id?{...s,isActive:false}:s)); toast.success('Deactivated') }
    catch { toast.error('Error') }
  }

  const f = k => e => setForm({...form,[k]:e.target.value})
  const box = { background:'linear-gradient(160deg,#0e0f14,#0a0b0e)', border:'1px solid #1e2028', borderRadius:10, overflow:'hidden' }

  return (
    <div>
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:20 }}>
        <div>
          <div style={{ fontFamily:"'Orbitron',monospace", fontSize:18, fontWeight:900, color:'#c0c0d0', letterSpacing:'.06em' }}>SERVICES</div>
          <div style={{ fontSize:11, color:'#33333f', marginTop:3 }}>Manage workshop offerings</div>
        </div>
        <button className="btn btn-primary btn-sm" onClick={openAdd}>+ ADD SERVICE</button>
      </div>

      {showForm && (
        <form onSubmit={handleSave} style={{ ...box, border:'1px solid #e8390e', padding:20, marginBottom:20, position:'relative' }}>
          <div style={{ position:'absolute', top:0, left:0, right:0, height:2, background:'#e8390e' }}/>
          <div style={{ fontFamily:"'Orbitron',monospace", fontSize:10, fontWeight:900, color:'#2a2a36', letterSpacing:'.12em', marginBottom:16 }}>{editing?'EDIT SERVICE':'NEW SERVICE'}</div>
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:14 }}>
            <div className="form-group" style={{ marginBottom:0, gridColumn:'span 2' }}>
              <label className="form-label">Service Name *</label>
              <input className="form-input" placeholder="e.g. Oil & Filter Change" value={form.name} onChange={f('name')} required/>
            </div>
            <div className="form-group" style={{ marginBottom:0, gridColumn:'span 2' }}>
              <label className="form-label">Description *</label>
              <textarea className="form-input" rows={2} placeholder="Describe what's included..." value={form.description} onChange={f('description')} required/>
            </div>
            <div className="form-group" style={{ marginBottom:0 }}>
              <label className="form-label">Category *</label>
              <select className="form-input" value={form.category} onChange={f('category')}>
                {CATS.map(c=><option key={c} value={c}>{c.replace('_',' ')}</option>)}
              </select>
            </div>
            <div className="form-group" style={{ marginBottom:0 }}>
              <label className="form-label">Status</label>
              <select className="form-input" value={form.isActive} onChange={e=>setForm({...form,isActive:e.target.value==='true'})}>
                <option value="true">Active</option>
                <option value="false">Inactive</option>
              </select>
            </div>
            <div className="form-group" style={{ marginBottom:0 }}>
              <label className="form-label">Base Price ($) *</label>
              <input className="form-input" type="number" min="0" step="0.01" placeholder="49.99" value={form.basePrice} onChange={f('basePrice')} required/>
            </div>
            <div className="form-group" style={{ marginBottom:0 }}>
              <label className="form-label">Estimated Hours *</label>
              <input className="form-input" type="number" min="0.5" step="0.5" placeholder="1.5" value={form.estimatedHours} onChange={f('estimatedHours')} required/>
            </div>
          </div>
          <div style={{ display:'flex', gap:8, marginTop:16 }}>
            <button type="submit" className="btn btn-primary btn-sm" disabled={saving}>{saving?'Saving...':editing?'Update':'Create'}</button>
            <button type="button" className="btn btn-ghost btn-sm" onClick={()=>setShowForm(false)}>Cancel</button>
          </div>
        </form>
      )}

      {loading ? <div className="loading"><div className="spinner"/></div> : (
        <div style={box}>
          <table style={{ width:'100%', borderCollapse:'collapse', fontSize:12 }}>
            <thead>
              <tr>
                {['Service','Category','Price','Est. Time','Status',''].map(h=>(
                  <th key={h} style={{ textAlign:'left', padding:'9px 14px', fontFamily:"'Orbitron',monospace", fontSize:8, fontWeight:700, letterSpacing:'.1em', color:'#1e1e28', borderBottom:'1px solid #1e2028', background:'#070809' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {services.map(s=>(
                <tr key={s._id} style={{ opacity:s.isActive?1:.5, transition:'background .15s' }}
                  onMouseEnter={e=>e.currentTarget.style.background='#0a0b0e'}
                  onMouseLeave={e=>e.currentTarget.style.background='transparent'}>
                  <td style={{ padding:'12px 14px', borderBottom:'1px solid #0f1014' }}>
                    <div style={{ fontWeight:600, color:'#555568' }}>{s.name}</div>
                    <div style={{ fontSize:10, color:'#2a2a36', maxWidth:280, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{s.description}</div>
                  </td>
                  <td style={{ padding:'12px 14px', borderBottom:'1px solid #0f1014', fontSize:11, color:'#33333f', textTransform:'capitalize' }}>{s.category.replace('_',' ')}</td>
                  <td style={{ padding:'12px 14px', borderBottom:'1px solid #0f1014', fontFamily:"'Orbitron',monospace", fontWeight:700, color:'#e8390e' }}>${s.basePrice?.toFixed(2)}</td>
                  <td style={{ padding:'12px 14px', borderBottom:'1px solid #0f1014', fontFamily:"'Orbitron',monospace", fontSize:10, color:'#33333f' }}>{s.estimatedHours}H</td>
                  <td style={{ padding:'12px 14px', borderBottom:'1px solid #0f1014' }}><span className={`badge ${s.isActive?'badge-completed':'badge-cancelled'}`}>{s.isActive?'Active':'Inactive'}</span></td>
                  <td style={{ padding:'12px 14px', borderBottom:'1px solid #0f1014' }}>
                    <div style={{ display:'flex', gap:4 }}>
                      <button className="btn btn-ghost btn-sm" onClick={()=>openEdit(s)}>✏</button>
                      {s.isActive && <button className="btn btn-danger btn-sm" onClick={()=>handleDelete(s._id)}>✕</button>}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
