import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { bookAPI } from '../api'

const TABS = ['all','pending','confirmed','in_progress','completed','cancelled']

export default function Bookings() {
  const [bookings, setBookings] = useState([])
  const [loading, setLoading] = useState(true)
  const [tab, setTab] = useState('all')
  const [search, setSearch] = useState('')

  useEffect(() => {
    setLoading(true)
    bookAPI.getAll(tab==='all'?'':tab).then(r=>setBookings(r.data)).finally(()=>setLoading(false))
  }, [tab])

  const filtered = bookings.filter(b =>
    !search ||
    b.customer?.name?.toLowerCase().includes(search.toLowerCase()) ||
    b.vehicle?.licensePlate?.toLowerCase().includes(search.toLowerCase()) ||
    b._id.includes(search)
  )

  const box = { background:'linear-gradient(160deg,#0e0f14,#0a0b0e)', border:'1px solid #1e2028', borderRadius:10, overflow:'hidden' }

  return (
    <div>
      <div style={{ fontFamily:"'Orbitron',monospace", fontSize:18, fontWeight:900, color:'#c0c0d0', letterSpacing:'.06em', marginBottom:4 }}>BOOKINGS</div>
      <div style={{ fontSize:11, color:'#33333f', marginBottom:18 }}>Manage all workshop appointments</div>

      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', flexWrap:'wrap', gap:12, marginBottom:18 }}>
        <div style={{ display:'flex', flexWrap:'wrap', gap:6 }}>
          {TABS.map(t => (
            <button key={t} onClick={()=>setTab(t)}
              style={{ background:tab===t?'#e8390e':'#0a0b0e', border:'1px solid', borderColor:tab===t?'#e8390e':'#1e2028', color:tab===t?'#fff':'#33333f', padding:'5px 12px', borderRadius:20, fontSize:9, fontWeight:700, cursor:'pointer', letterSpacing:'.06em', transition:'all .18s', fontFamily:"'Orbitron',monospace" }}>
              {t.replace('_',' ').toUpperCase()}
            </button>
          ))}
        </div>
        <input className="form-input" placeholder="Search name, plate..." value={search} onChange={e=>setSearch(e.target.value)} style={{ width:220, fontSize:12 }}/>
      </div>

      {loading ? <div className="loading"><div className="spinner"/></div> : (
        <div style={box}>
          <table style={{ width:'100%', borderCollapse:'collapse', fontSize:12 }}>
            <thead>
              <tr>
                {['Job ID','Customer','Vehicle','Date','Services','Status','Total',''].map(h => (
                  <th key={h} style={{ textAlign:'left', padding:'9px 14px', fontFamily:"'Orbitron',monospace", fontSize:8, fontWeight:700, letterSpacing:'.1em', color:'#1e1e28', borderBottom:'1px solid #1e2028', background:'#070809' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr><td colSpan={8} style={{ textAlign:'center', padding:40, color:'#33333f' }}>No bookings found</td></tr>
              ) : filtered.map(b => (
                <tr key={b._id} onMouseEnter={e=>e.currentTarget.style.background='#0a0b0e'} onMouseLeave={e=>e.currentTarget.style.background='transparent'} style={{ transition:'background .15s' }}>
                  <td style={{ padding:'11px 14px', borderBottom:'1px solid #0f1014', fontFamily:"'Orbitron',monospace", fontSize:9, color:'#2a2a36' }}>#{b._id.slice(-6).toUpperCase()}</td>
                  <td style={{ padding:'11px 14px', borderBottom:'1px solid #0f1014' }}>
                    <div style={{ fontWeight:600, color:'#555568' }}>{b.customer?.name}</div>
                    <div style={{ fontSize:10, color:'#2a2a36' }}>{b.customer?.email}</div>
                  </td>
                  <td style={{ padding:'11px 14px', borderBottom:'1px solid #0f1014' }}>
                    <div style={{ color:'#555568' }}>{b.vehicle?.make} {b.vehicle?.model}</div>
                    <div style={{ fontFamily:"'Orbitron',monospace", fontSize:9, background:'#070809', padding:'1px 5px', borderRadius:3, color:'#33333f', display:'inline-block', marginTop:2 }}>{b.vehicle?.licensePlate}</div>
                  </td>
                  <td style={{ padding:'11px 14px', borderBottom:'1px solid #0f1014', fontFamily:"'Orbitron',monospace", fontSize:9, color:'#2a2a36' }}>
                    {new Date(b.scheduledDate).toLocaleDateString('en-US',{month:'short',day:'numeric'})}<br/>{b.scheduledTime}
                  </td>
                  <td style={{ padding:'11px 14px', borderBottom:'1px solid #0f1014', fontSize:11, color:'#33333f', maxWidth:160, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{b.services?.map(s=>s.name).join(', ')}</td>
                  <td style={{ padding:'11px 14px', borderBottom:'1px solid #0f1014' }}><span className={`badge badge-${b.status}`}>{b.status.replace('_',' ')}</span></td>
                  <td style={{ padding:'11px 14px', borderBottom:'1px solid #0f1014', fontFamily:"'Orbitron',monospace", fontWeight:700, color:'#e8390e' }}>${b.totalAmount?.toFixed(2)}</td>
                  <td style={{ padding:'11px 14px', borderBottom:'1px solid #0f1014' }}><Link to={'/bookings/'+b._id} className="btn btn-ghost btn-sm">View</Link></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
