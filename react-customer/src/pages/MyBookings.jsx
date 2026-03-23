import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { bookingsAPI } from '../api'

const TABS = ['all','pending','confirmed','in_progress','completed','cancelled']

export default function MyBookings() {
  const [bookings, setBookings] = useState([])
  const [loading, setLoading] = useState(true)
  const [tab, setTab] = useState('all')

  useEffect(() => {
    setLoading(true)
    bookingsAPI.getAll(tab==='all'?'':tab).then(r=>setBookings(r.data)).finally(()=>setLoading(false))
  }, [tab])

  return (
    <div style={{ padding:24, background:'#050608', minHeight:'calc(100vh - 58px)' }}>
      <div style={{ maxWidth:1000, margin:'0 auto' }}>
        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:16 }}>
          <div>
            <div style={{ fontFamily:"'Orbitron',monospace", fontSize:18, fontWeight:900, color:'#c0c0d0', letterSpacing:'.06em' }}>MY BOOKINGS</div>
            <div style={{ fontSize:11, color:'#33333f', marginTop:3 }}>Track all your service appointments</div>
          </div>
          <Link to="/book" className="btn btn-primary btn-sm">+ BOOK NEW</Link>
        </div>
        <div style={{ display:'flex', flexWrap:'wrap', gap:6, marginBottom:20 }}>
          {TABS.map(t=>(
            <button key={t} onClick={()=>setTab(t)}
              style={{ background:tab===t?'#e8390e':'#0a0b0e', border:'1px solid', borderColor:tab===t?'#e8390e':'#1e2028', color:tab===t?'#fff':'#33333f', padding:'5px 12px', borderRadius:20, fontSize:9, fontWeight:700, cursor:'pointer', letterSpacing:'.06em', transition:'all .18s', fontFamily:"'Orbitron',monospace" }}>
              {t.replace('_',' ').toUpperCase()}
            </button>
          ))}
        </div>
        {loading ? <div className="loading"><div className="spinner"/></div> : bookings.length===0 ? (
          <div className="empty-state">
            <h3>No bookings found</h3>
            <p style={{ marginBottom:20 }}>Book your first service today</p>
            <Link to="/book" className="btn btn-primary">Book Appointment</Link>
          </div>
        ) : (
          <div style={{ display:'flex', flexDirection:'column', gap:9 }}>
            {bookings.map(b=>(
              <Link key={b._id} to={'/bookings/'+b._id} style={{ background:'linear-gradient(160deg,#0e0f14,#0a0b0e)', border:'1px solid #1e2028', borderLeft:'2px solid #1e1e28', borderRadius:10, padding:'14px 18px', display:'flex', justifyContent:'space-between', alignItems:'center', textDecoration:'none', transition:'all .22s', gap:12 }}
                onMouseEnter={e=>{e.currentTarget.style.borderLeftColor='#e8390e';e.currentTarget.style.transform='translateX(3px)'}}
                onMouseLeave={e=>{e.currentTarget.style.borderLeftColor='#1e1e28';e.currentTarget.style.transform='none'}}>
                <div>
                  <div style={{ fontFamily:"'Orbitron',monospace", fontSize:8, color:'#2a2a36', letterSpacing:'.08em', marginBottom:3 }}>JOB #{b._id.slice(-6).toUpperCase()}</div>
                  <div style={{ fontFamily:"'Rajdhani',sans-serif", fontSize:13, fontWeight:700, color:'#888890', marginBottom:1 }}>{b.vehicle?.year} {b.vehicle?.make} {b.vehicle?.model} — {b.vehicle?.licensePlate}</div>
                  <div style={{ fontSize:10, color:'#2a2a36', marginBottom:3 }}>{b.services?.map(s=>s.name).join(' · ')}</div>
                  <div style={{ fontFamily:"'Orbitron',monospace", fontSize:9, color:'#222228', letterSpacing:'.04em' }}>{new Date(b.scheduledDate).toLocaleDateString('en-US',{weekday:'short',month:'short',day:'numeric'})} · {b.scheduledTime}</div>
                </div>
                <div style={{ display:'flex', flexDirection:'column', alignItems:'flex-end', gap:7, flexShrink:0 }}>
                  <span className={`badge badge-${b.status}`}>{b.status.replace('_',' ')}</span>
                  <span style={{ fontFamily:"'Orbitron',monospace", fontSize:13, fontWeight:900, color:'#e8390e' }}>${b.totalAmount?.toFixed(2)}</span>
                  <span style={{ fontSize:14, color:'#33333f' }}>›</span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
