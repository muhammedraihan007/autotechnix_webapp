import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { bookingsAPI } from '../api'

export default function BookingDetail() {
  const { id } = useParams()
  const [booking, setBooking] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => { bookingsAPI.getOne(id).then(r=>setBooking(r.data)).finally(()=>setLoading(false)) }, [id])

  if (loading) return <div className="loading"><div className="spinner"/></div>
  if (!booking) return <div style={{ padding:40 }}><Link to="/bookings" className="btn btn-outline">← Back</Link><p style={{ marginTop:16, color:'#33333f' }}>Booking not found.</p></div>

  const box = { background:'linear-gradient(160deg,#0e0f14,#0a0b0e)', border:'1px solid #1e2028', borderRadius:9, padding:18, marginBottom:12 }
  const boxTitle = { fontFamily:"'Orbitron',monospace", fontSize:8, fontWeight:700, color:'#2a2a36', letterSpacing:'.16em', marginBottom:12, display:'flex', alignItems:'center', gap:6 }
  const row = { display:'flex', justifyContent:'space-between', padding:'6px 0', borderBottom:'1px solid #0f1014', fontSize:12 }

  return (
    <div style={{ padding:24, background:'#050608', minHeight:'calc(100vh - 58px)' }}>
      <div style={{ maxWidth:900, margin:'0 auto' }}>
        <Link to="/bookings" style={{ display:'inline-flex', alignItems:'center', gap:7, color:'#555568', fontSize:12, marginBottom:20, textDecoration:'none' }}>← Back to Bookings</Link>
        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:24, flexWrap:'wrap', gap:12 }}>
          <div>
            <div style={{ fontFamily:"'Orbitron',monospace", fontSize:18, fontWeight:900, color:'#c0c0d0', letterSpacing:'.06em' }}>JOB #{booking._id.slice(-6).toUpperCase()}</div>
            <div style={{ fontSize:11, color:'#33333f', marginTop:3 }}>{new Date(booking.createdAt).toLocaleDateString('en-US',{year:'numeric',month:'long',day:'numeric'})}</div>
          </div>
          <span className={`badge badge-${booking.status}`} style={{ fontSize:11, padding:'5px 14px' }}>{booking.status.replace('_',' ')}</span>
        </div>
        <div style={{ display:'grid', gridTemplateColumns:'1fr 320px', gap:16, alignItems:'start' }}>
          <div>
            <div style={box}>
              <div style={boxTitle}><div style={{ width:2, height:10, background:'#e8390e', borderRadius:1 }}/>VEHICLE</div>
              {[['Make',booking.vehicle?.make],['Model',booking.vehicle?.model],['Year',booking.vehicle?.year],['Plate',booking.vehicle?.licensePlate],['Fuel',booking.vehicle?.fuelType]].map(([k,v])=>(
                <div key={k} style={row}><span style={{ color:'#33333f' }}>{k}</span><span style={{ color:'#888890', fontWeight:600 }}>{v}</span></div>
              ))}
            </div>
            <div style={box}>
              <div style={boxTitle}><div style={{ width:2, height:10, background:'#e8390e', borderRadius:1 }}/>SCHEDULE</div>
              <div style={row}><span style={{ color:'#33333f' }}>Date</span><span style={{ color:'#888890', fontWeight:600 }}>{new Date(booking.scheduledDate).toLocaleDateString('en-US',{weekday:'long',year:'numeric',month:'long',day:'numeric'})}</span></div>
              <div style={{ ...row, borderBottom:'none' }}><span style={{ color:'#33333f' }}>Time</span><span style={{ fontFamily:"'Orbitron',monospace", color:'#888890', fontWeight:700 }}>{booking.scheduledTime}</span></div>
            </div>
            {booking.assignedTechnician && (
              <div style={box}>
                <div style={boxTitle}><div style={{ width:2, height:10, background:'#e8390e', borderRadius:1 }}/>TECHNICIAN</div>
                <div style={{ color:'#888890', fontSize:13 }}>{booking.assignedTechnician.name}</div>
              </div>
            )}
            {booking.customerNotes && (
              <div style={box}>
                <div style={boxTitle}><div style={{ width:2, height:10, background:'#e8390e', borderRadius:1 }}/>YOUR NOTES</div>
                <p style={{ fontSize:12, color:'#555568' }}>{booking.customerNotes}</p>
              </div>
            )}
            {booking.adminNotes && (
              <div style={{ ...box, border:'1px solid rgba(59,130,246,.3)' }}>
                <div style={boxTitle}><div style={{ width:2, height:10, background:'#3b82f6', borderRadius:1 }}/>WORKSHOP NOTES</div>
                <p style={{ fontSize:12, color:'#555568' }}>{booking.adminNotes}</p>
              </div>
            )}
          </div>
          <div>
            <div style={box}>
              <div style={boxTitle}><div style={{ width:2, height:10, background:'#e8390e', borderRadius:1 }}/>SERVICES</div>
              {booking.services?.map(s=>(
                <div key={s._id} style={row}><span style={{ color:'#555568' }}>{s.name}</span><span style={{ fontFamily:"'Orbitron',monospace", color:'#e8390e', fontWeight:700 }}>${s.basePrice?.toFixed(2)}</span></div>
              ))}
              <div style={{ display:'flex', justifyContent:'space-between', paddingTop:10, fontSize:14, fontWeight:700, color:'#c0c0d0' }}>
                <span>TOTAL</span><span style={{ fontFamily:"'Orbitron',monospace", color:'#e8390e' }}>${booking.totalAmount?.toFixed(2)}</span>
              </div>
            </div>
            {booking.statusHistory?.length>0 && (
              <div style={box}>
                <div style={boxTitle}><div style={{ width:2, height:10, background:'#e8390e', borderRadius:1 }}/>STATUS HISTORY</div>
                <div style={{ display:'flex', flexDirection:'column', gap:12 }}>
                  {[...booking.statusHistory].reverse().map((h,i)=>(
                    <div key={i} style={{ display:'flex', gap:10, alignItems:'flex-start' }}>
                      <div style={{ width:7, height:7, borderRadius:'50%', background:'#e8390e', flexShrink:0, marginTop:4 }}/>
                      <div>
                        <span className={`badge badge-${h.status}`}>{h.status.replace('_',' ')}</span>
                        <div style={{ fontSize:10, color:'#1e1e28', marginTop:3 }}>{new Date(h.changedAt).toLocaleString()}</div>
                        {h.note && <div style={{ fontSize:11, color:'#555568', marginTop:2 }}>{h.note}</div>}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
