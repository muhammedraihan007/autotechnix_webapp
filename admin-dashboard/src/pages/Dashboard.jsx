import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { dashAPI } from '../api'
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts'

const MONTHS = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec']

export default function Dashboard() {
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => { dashAPI.stats().then(r=>setStats(r.data)).finally(()=>setLoading(false)) }, [])

  if (loading) return <div className="loading"><div className="spinner"/></div>

  const chartData = stats?.byMonth?.map(m => ({ name: MONTHS[m._id.month-1], bookings: m.count })) || []

  const cards = [
    { label:'Total Jobs', value:stats?.totalBookings||0, icon:'📅', color:'#3b82f6' },
    { label:'Pending', value:stats?.pendingBookings||0, icon:'⏳', color:'#f59e0b' },
    { label:'Completed', value:stats?.completedBookings||0, icon:'✓', color:'#22c55e' },
    { label:'Customers', value:stats?.totalCustomers||0, icon:'👥', color:'#a855f7' },
    { label:'Revenue', value:'$'+(stats?.totalRevenue||0).toLocaleString('en',{minimumFractionDigits:2,maximumFractionDigits:2}), icon:'$', color:'#e8390e' },
  ]

  const box = { background:'linear-gradient(160deg,#0e0f14,#0a0b0e)', border:'1px solid #1e2028', borderRadius:10, overflow:'hidden', position:'relative' }

  return (
    <div>
      <div style={{ fontFamily:"'Orbitron',monospace", fontSize:18, fontWeight:900, color:'#c0c0d0', letterSpacing:'.06em', marginBottom:4 }}>DASHBOARD</div>
      <div style={{ fontSize:11, color:'#33333f', marginBottom:20 }}>Live workshop overview</div>

      <div style={{ display:'grid', gridTemplateColumns:'repeat(5,1fr)', gap:10, marginBottom:20 }}>
        {cards.map((c,i) => (
          <div key={c.label} style={{ ...box, padding:16, animationDelay:i*.05+'s' }}>
            <div style={{ position:'absolute', top:0, left:0, right:0, height:2, background:c.color }}/>
            <div style={{ fontSize:18, marginBottom:8 }}>{c.icon}</div>
            <div style={{ fontFamily:"'Orbitron',monospace", fontSize:20, fontWeight:900, color:'#c0c0d0', lineHeight:1 }}>{c.value}</div>
            <div style={{ fontSize:9, color:'#33333f', marginTop:4, letterSpacing:'.06em', textTransform:'uppercase' }}>{c.label}</div>
          </div>
        ))}
      </div>

      <div style={{ display:'grid', gridTemplateColumns:'1fr 340px', gap:16, alignItems:'start' }}>
        <div style={{ ...box, padding:20 }}>
          <div style={{ fontFamily:"'Orbitron',monospace", fontSize:9, color:'#2a2a36', letterSpacing:'.12em', marginBottom:16 }}>BOOKINGS — LAST 6 MONTHS</div>
          {chartData.length > 0 ? (
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={chartData} margin={{ top:10, right:10, left:-20, bottom:0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e2028"/>
                <XAxis dataKey="name" tick={{ fill:'#33333f', fontSize:10, fontFamily:'Orbitron,monospace' }} axisLine={false} tickLine={false}/>
                <YAxis tick={{ fill:'#33333f', fontSize:10 }} axisLine={false} tickLine={false}/>
                <Tooltip contentStyle={{ background:'#0f1016', border:'1px solid #1e2028', borderRadius:8, color:'#eeeef2', fontFamily:'Orbitron,monospace', fontSize:11 }} cursor={{ fill:'rgba(232,57,14,.06)' }}/>
                <Bar dataKey="bookings" fill="#e8390e" radius={[4,4,0,0]}/>
              </BarChart>
            </ResponsiveContainer>
          ) : <div className="empty-state" style={{ padding:40 }}><p>Not enough data yet</p></div>}
        </div>

        <div style={{ ...box }}>
          <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', padding:'14px 16px', borderBottom:'1px solid #1e2028' }}>
            <div style={{ fontFamily:"'Orbitron',monospace", fontSize:9, color:'#2a2a36', letterSpacing:'.12em' }}>RECENT JOBS</div>
            <Link to="/bookings" className="btn btn-ghost btn-sm">View All</Link>
          </div>
          {stats?.recentBookings?.length > 0 ? (
            <div>
              {stats.recentBookings.map(b => (
                <Link key={b._id} to={'/bookings/'+b._id} style={{ display:'flex', justifyContent:'space-between', alignItems:'center', padding:'11px 16px', borderBottom:'1px solid #0f1014', textDecoration:'none', transition:'background .15s' }}
                  onMouseEnter={e=>e.currentTarget.style.background='#0a0b0e'}
                  onMouseLeave={e=>e.currentTarget.style.background='transparent'}>
                  <div>
                    <div style={{ fontSize:12, fontWeight:600, color:'#555568' }}>{b.customer?.name}</div>
                    <div style={{ fontSize:10, color:'#2a2a36' }}>{b.vehicle?.make} {b.vehicle?.model}</div>
                  </div>
                  <span className={`badge badge-${b.status}`}>{b.status.replace('_',' ')}</span>
                </Link>
              ))}
            </div>
          ) : <div className="empty-state" style={{ padding:30 }}><p>No bookings yet</p></div>}
        </div>
      </div>
    </div>
  )
}
