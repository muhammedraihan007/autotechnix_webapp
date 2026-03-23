import { useEffect, useState } from 'react'
import { invAPI, bookAPI } from '../api'
import toast from 'react-hot-toast'

export default function Invoices() {
  const [invoices, setInvoices] = useState([])
  const [completedBookings, setCompletedBookings] = useState([])
  const [loading, setLoading] = useState(true)
  const [showCreate, setShowCreate] = useState(false)
  const [form, setForm] = useState({ bookingId:'', tax:'0', discount:'0', notes:'' })
  const [saving, setSaving] = useState(false)
  const [viewing, setViewing] = useState(null)

  useEffect(() => {
    Promise.all([invAPI.getAll(), bookAPI.getAll('completed')])
      .then(([ir,br])=>{ setInvoices(ir.data); setCompletedBookings(br.data) })
      .finally(()=>setLoading(false))
  }, [])

  const handleCreate = async e => {
    e.preventDefault(); setSaving(true)
    try {
      const { data } = await invAPI.create({ ...form, tax:parseFloat(form.tax)||0, discount:parseFloat(form.discount)||0 })
      setInvoices(p=>[data,...p]); setShowCreate(false)
      setForm({ bookingId:'', tax:'0', discount:'0', notes:'' })
      toast.success('Invoice created')
    } catch (err) { toast.error(err.response?.data?.message || 'Error') }
    finally { setSaving(false) }
  }

  const handleMarkPaid = async id => {
    try {
      const { data } = await invAPI.markPaid(id)
      setInvoices(p=>p.map(i=>i._id===id?data:i))
      setViewing(v=>v?data:null)
      toast.success('Marked as paid')
    } catch { toast.error('Error') }
  }

  const loadDetail = async id => {
    try { const { data } = await invAPI.getOne(id); setViewing(data) }
    catch { toast.error('Could not load invoice') }
  }

  const box = { background:'linear-gradient(160deg,#0e0f14,#0a0b0e)', border:'1px solid #1e2028', borderRadius:10, overflow:'hidden' }

  return (
    <div>
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:20 }}>
        <div>
          <div style={{ fontFamily:"'Orbitron',monospace", fontSize:18, fontWeight:900, color:'#c0c0d0', letterSpacing:'.06em' }}>INVOICES</div>
          <div style={{ fontSize:11, color:'#33333f', marginTop:3 }}>Create and manage customer invoices</div>
        </div>
        <button className="btn btn-primary btn-sm" onClick={()=>setShowCreate(true)}>+ CREATE INVOICE</button>
      </div>

      {showCreate && (
        <form onSubmit={handleCreate} style={{ ...box, border:'1px solid #e8390e', padding:20, marginBottom:18, position:'relative' }}>
          <div style={{ position:'absolute', top:0, left:0, right:0, height:2, background:'#e8390e' }}/>
          <div style={{ fontFamily:"'Orbitron',monospace", fontSize:10, color:'#2a2a36', letterSpacing:'.12em', marginBottom:14 }}>NEW INVOICE</div>
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:12 }}>
            <div className="form-group" style={{ marginBottom:0, gridColumn:'span 2' }}>
              <label className="form-label">Completed Booking *</label>
              <select className="form-input" value={form.bookingId} onChange={e=>setForm({...form,bookingId:e.target.value})} required>
                <option value="">— Select a completed booking —</option>
                {completedBookings.map(b=>(
                  <option key={b._id} value={b._id}>#{b._id.slice(-6).toUpperCase()} — {b.customer?.name} — {b.vehicle?.make} {b.vehicle?.model} — ${b.totalAmount?.toFixed(2)}</option>
                ))}
              </select>
            </div>
            <div className="form-group" style={{ marginBottom:0 }}>
              <label className="form-label">Tax ($)</label>
              <input className="form-input" type="number" min="0" step="0.01" value={form.tax} onChange={e=>setForm({...form,tax:e.target.value})}/>
            </div>
            <div className="form-group" style={{ marginBottom:0 }}>
              <label className="form-label">Discount ($)</label>
              <input className="form-input" type="number" min="0" step="0.01" value={form.discount} onChange={e=>setForm({...form,discount:e.target.value})}/>
            </div>
            <div className="form-group" style={{ marginBottom:0, gridColumn:'span 2' }}>
              <label className="form-label">Notes</label>
              <input className="form-input" placeholder="Optional note for customer..." value={form.notes} onChange={e=>setForm({...form,notes:e.target.value})}/>
            </div>
          </div>
          <div style={{ display:'flex', gap:8, marginTop:14 }}>
            <button type="submit" className="btn btn-primary btn-sm" disabled={saving}>{saving?'Creating...':'Create Invoice'}</button>
            <button type="button" className="btn btn-ghost btn-sm" onClick={()=>setShowCreate(false)}>Cancel</button>
          </div>
        </form>
      )}

      {viewing && (
        <div style={{ position:'fixed', inset:0, background:'rgba(0,0,0,.8)', display:'flex', alignItems:'center', justifyContent:'center', zIndex:200, padding:24 }} onClick={()=>setViewing(null)}>
          <div style={{ background:'#0f1016', border:'1px solid #1e2028', borderRadius:14, padding:28, width:'100%', maxWidth:520, maxHeight:'90vh', overflowY:'auto', position:'relative' }} onClick={e=>e.stopPropagation()}>
            <div style={{ position:'absolute', top:0, left:0, right:0, height:2, background:'#e8390e' }}/>
            <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:16 }}>
              <div style={{ fontFamily:"'Orbitron',monospace", fontSize:14, fontWeight:900, color:'#c0c0d0' }}>{viewing.invoiceNumber}</div>
              <button className="btn btn-ghost btn-sm" onClick={()=>setViewing(null)}>✕</button>
            </div>
            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:10, marginBottom:16 }}>
              {[['Customer',viewing.customer?.name],['Email',viewing.customer?.email],['Vehicle',viewing.booking?.vehicle?.year+' '+viewing.booking?.vehicle?.make+' '+viewing.booking?.vehicle?.model],['Plate',viewing.booking?.vehicle?.licensePlate]].map(([l,v])=>(
                <div key={l}>
                  <div style={{ fontFamily:"'Orbitron',monospace", fontSize:8, color:'#2a2a36', letterSpacing:'.12em', marginBottom:3 }}>{l}</div>
                  <div style={{ fontSize:13, color:'#888890', fontWeight:600 }}>{v}</div>
                </div>
              ))}
            </div>
            <div style={{ borderTop:'1px solid #1e2028', paddingTop:14, marginBottom:14 }}>
              <table style={{ width:'100%', borderCollapse:'collapse', fontSize:12 }}>
                <thead><tr>{['Description','Qty','Unit Price','Total'].map(h=><th key={h} style={{ textAlign:'left', padding:'6px 0', fontFamily:"'Orbitron',monospace", fontSize:8, color:'#2a2a36', letterSpacing:'.08em', borderBottom:'1px solid #1e2028' }}>{h}</th>)}</tr></thead>
                <tbody>
                  {viewing.items?.map((item,i)=>(
                    <tr key={i}>
                      <td style={{ padding:'8px 0', borderBottom:'1px solid #0f1014', color:'#555568' }}>{item.description}</td>
                      <td style={{ padding:'8px 0', borderBottom:'1px solid #0f1014', color:'#33333f' }}>{item.quantity}</td>
                      <td style={{ padding:'8px 0', borderBottom:'1px solid #0f1014', color:'#33333f' }}>${item.unitPrice?.toFixed(2)}</td>
                      <td style={{ padding:'8px 0', borderBottom:'1px solid #0f1014', color:'#33333f' }}>${item.total?.toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div style={{ display:'flex', flexDirection:'column', alignItems:'flex-end', gap:6, marginBottom:16 }}>
              <div style={{ display:'flex', gap:40, fontSize:13, color:'#33333f' }}><span>Subtotal</span><span>${viewing.subtotal?.toFixed(2)}</span></div>
              {viewing.tax>0 && <div style={{ display:'flex', gap:40, fontSize:13, color:'#33333f' }}><span>Tax</span><span>+${viewing.tax?.toFixed(2)}</span></div>}
              {viewing.discount>0 && <div style={{ display:'flex', gap:40, fontSize:13, color:'#22c55e' }}><span>Discount</span><span>-${viewing.discount?.toFixed(2)}</span></div>}
              <div style={{ display:'flex', gap:40, fontSize:15, fontWeight:700, color:'#c0c0d0', paddingTop:8, borderTop:'1px solid #1e2028', width:'100%', justifyContent:'flex-end' }}><span>TOTAL</span><span style={{ fontFamily:"'Orbitron',monospace", color:'#e8390e' }}>${viewing.totalAmount?.toFixed(2)}</span></div>
            </div>
            {viewing.notes && <p style={{ fontSize:12, color:'#33333f', marginBottom:14 }}>{viewing.notes}</p>}
            <div style={{ display:'flex', gap:8 }}>
              {viewing.status!=='paid' && <button className="btn btn-success btn-sm" onClick={()=>handleMarkPaid(viewing._id)}>✓ Mark as Paid</button>}
              <button className="btn btn-ghost btn-sm" onClick={()=>setViewing(null)}>Close</button>
            </div>
          </div>
        </div>
      )}

      {loading ? <div className="loading"><div className="spinner"/></div> : (
        <div style={box}>
          <table style={{ width:'100%', borderCollapse:'collapse', fontSize:12 }}>
            <thead>
              <tr>{['Invoice #','Customer','Vehicle','Amount','Status','Date',''].map(h=>(
                <th key={h} style={{ textAlign:'left', padding:'9px 14px', fontFamily:"'Orbitron',monospace", fontSize:8, fontWeight:700, letterSpacing:'.1em', color:'#1e1e28', borderBottom:'1px solid #1e2028', background:'#070809' }}>{h}</th>
              ))}</tr>
            </thead>
            <tbody>
              {invoices.length===0 ? (
                <tr><td colSpan={7} style={{ textAlign:'center', padding:40, color:'#33333f' }}>No invoices yet. Create one from a completed booking.</td></tr>
              ) : invoices.map(inv=>(
                <tr key={inv._id} style={{ transition:'background .15s' }}
                  onMouseEnter={e=>e.currentTarget.style.background='#0a0b0e'}
                  onMouseLeave={e=>e.currentTarget.style.background='transparent'}>
                  <td style={{ padding:'11px 14px', borderBottom:'1px solid #0f1014', fontFamily:"'Orbitron',monospace", fontSize:9, color:'#2a2a36' }}>{inv.invoiceNumber}</td>
                  <td style={{ padding:'11px 14px', borderBottom:'1px solid #0f1014', fontWeight:600, color:'#555568' }}>{inv.customer?.name}</td>
                  <td style={{ padding:'11px 14px', borderBottom:'1px solid #0f1014', fontSize:11, color:'#33333f' }}>{inv.booking?.vehicle?.make} {inv.booking?.vehicle?.model}</td>
                  <td style={{ padding:'11px 14px', borderBottom:'1px solid #0f1014', fontFamily:"'Orbitron',monospace", fontWeight:700, color:'#e8390e' }}>${inv.totalAmount?.toFixed(2)}</td>
                  <td style={{ padding:'11px 14px', borderBottom:'1px solid #0f1014' }}><span className={`badge badge-${inv.status}`}>{inv.status}</span></td>
                  <td style={{ padding:'11px 14px', borderBottom:'1px solid #0f1014', fontFamily:"'Orbitron',monospace", fontSize:9, color:'#2a2a36' }}>{new Date(inv.createdAt).toLocaleDateString()}</td>
                  <td style={{ padding:'11px 14px', borderBottom:'1px solid #0f1014' }}>
                    <div style={{ display:'flex', gap:4 }}>
                      <button className="btn btn-ghost btn-sm" onClick={()=>loadDetail(inv._id)}>View</button>
                      {inv.status!=='paid' && <button className="btn btn-success btn-sm" onClick={()=>handleMarkPaid(inv._id)}>Paid</button>}
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
