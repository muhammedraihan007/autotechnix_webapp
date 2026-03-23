import { useEffect, useState } from 'react'
import { invoicesAPI } from '../api'

export default function MyInvoices() {
  const [invoices, setInvoices] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => { invoicesAPI.getAll().then(r=>setInvoices(r.data)).finally(()=>setLoading(false)) }, [])

  return (
    <div style={{ padding:24, background:'#050608', minHeight:'calc(100vh - 58px)' }}>
      <div style={{ maxWidth:900, margin:'0 auto' }}>
        <div style={{ fontFamily:"'Orbitron',monospace", fontSize:18, fontWeight:900, color:'#c0c0d0', letterSpacing:'.06em', marginBottom:4 }}>MY INVOICES</div>
        <div style={{ fontSize:11, color:'#33333f', marginBottom:20 }}>View and track your invoices</div>
        {loading ? <div className="loading"><div className="spinner"/></div> :
          invoices.length===0 ? (
            <div className="empty-state"><h3>No invoices yet</h3><p>Invoices appear here after your service is completed</p></div>
          ) : (
            <div style={{ display:'flex', flexDirection:'column', gap:10 }}>
              {invoices.map(inv=>(
                <div key={inv._id} style={{ background:'linear-gradient(160deg,#0e0f14,#0a0b0e)', border:'1px solid #1e2028', borderRadius:10, padding:'16px 20px', display:'flex', justifyContent:'space-between', alignItems:'center', flexWrap:'wrap', gap:12 }}>
                  <div>
                    <div style={{ fontFamily:"'Orbitron',monospace", fontSize:9, color:'#2a2a36', letterSpacing:'.08em', marginBottom:4 }}>{inv.invoiceNumber}</div>
                    <div style={{ fontFamily:"'Rajdhani',sans-serif", fontSize:14, fontWeight:700, color:'#888890', marginBottom:2 }}>{inv.booking?.vehicle?.year} {inv.booking?.vehicle?.make} {inv.booking?.vehicle?.model}</div>
                    <div style={{ fontFamily:"'Orbitron',monospace", fontSize:9, color:'#1e1e28' }}>{new Date(inv.createdAt).toLocaleDateString('en-US',{year:'numeric',month:'short',day:'numeric'})}</div>
                  </div>
                  <div style={{ display:'flex', flexDirection:'column', alignItems:'flex-end', gap:7 }}>
                    <span className={`badge badge-${inv.status}`}>{inv.status}</span>
                    <span style={{ fontFamily:"'Orbitron',monospace", fontSize:16, fontWeight:900, color:'#e8390e' }}>${inv.totalAmount?.toFixed(2)}</span>
                    {inv.status!=='paid' && inv.dueDate && <div style={{ fontSize:10, color:'#33333f' }}>Due {new Date(inv.dueDate).toLocaleDateString()}</div>}
                    {inv.paidAt && <div style={{ fontSize:10, color:'#22c55e' }}>Paid {new Date(inv.paidAt).toLocaleDateString()}</div>}
                  </div>
                </div>
              ))}
            </div>
          )}
      </div>
    </div>
  )
}
