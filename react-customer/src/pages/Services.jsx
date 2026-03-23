import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { servicesAPI } from '../api'

const CATS = [
  { value:'', label:'All' },
  { value:'oil_change', label:'Oil Change' },
  { value:'brake', label:'Brakes' },
  { value:'tire', label:'Tyres' },
  { value:'engine', label:'Engine' },
  { value:'ac', label:'AC' },
  { value:'electrical', label:'Electrical' },
  { value:'inspection', label:'Inspection' },
  { value:'body', label:'Body' },
]

const THUMBS = { oil_change:'🔧', brake:'🔴', tire:'🛞', engine:'🔍', ac:'❄️', electrical:'🔋', inspection:'🔎', body:'🚗', other:'⚙️' }
const BG = ['linear-gradient(135deg,#1a1208,#2a2010)','linear-gradient(135deg,#0a0e1a,#101828)','linear-gradient(135deg,#100a0a,#1e0e0e)','linear-gradient(135deg,#0a1210,#101e1c)','linear-gradient(135deg,#0e0a18,#180e28)','linear-gradient(135deg,#14100a,#221a0e)']

export default function Services() {
  const { user } = useAuth()
  const [services, setServices] = useState([])
  const [loading, setLoading] = useState(true)
  const [cat, setCat] = useState('')

  useEffect(() => {
    setLoading(true)
    servicesAPI.getAll(cat).then(r => setServices(r.data)).finally(() => setLoading(false))
  }, [cat])

  return (
    <div style={{ padding:'24px', background:'#050608', minHeight:'calc(100vh - 58px)' }}>
      <div style={{ maxWidth:1200, margin:'0 auto' }}>
        <div style={{ fontFamily:"'Orbitron',monospace", fontSize:18, fontWeight:900, color:'#c0c0d0', letterSpacing:'.08em', marginBottom:4 }}>ALL <span style={{ color:'#e8390e' }}>SERVICES</span></div>
        <div style={{ fontSize:11, color:'#33333f', marginBottom:18 }}>Professional care for every make and model</div>
        <div style={{ display:'flex', flexWrap:'wrap', gap:6, marginBottom:20 }}>
          {CATS.map(c => (
            <button key={c.value} onClick={() => setCat(c.value)}
              style={{ background: cat===c.value ? '#e8390e' : '#0a0b0e', border: '1px solid', borderColor: cat===c.value ? '#e8390e' : '#1e2028', color: cat===c.value ? '#fff' : '#33333f', padding:'4px 12px', borderRadius:20, fontSize:10, fontWeight:700, cursor:'pointer', letterSpacing:'.05em', transition:'all .18s' }}>
              {c.label}
            </button>
          ))}
        </div>
        {loading ? <div className="loading"><div className="spinner"/></div> : (
          <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(280px,1fr))', gap:12 }}>
            {services.map((s, i) => (
              <div key={s._id} style={{ borderRadius:10, overflow:'hidden', border:'1px solid #1e2028', transition:'all .22s', cursor:'pointer' }}
                onMouseEnter={e=>{e.currentTarget.style.transform='translateY(-4px)';e.currentTarget.style.borderColor='#2a2c38'}}
                onMouseLeave={e=>{e.currentTarget.style.transform='none';e.currentTarget.style.borderColor='#1e2028'}}>
                <div style={{ height:76, background:BG[i%BG.length], display:'flex', alignItems:'center', justifyContent:'center', fontSize:28, position:'relative' }}>
                  <div style={{ position:'absolute', inset:0, background:'repeating-linear-gradient(82deg,rgba(255,255,255,0) 0%,rgba(255,255,255,.04) 1px,rgba(255,255,255,0) 2px,rgba(255,255,255,0) 6px)' }} />
                  <span style={{ position:'relative', zIndex:1 }}>{THUMBS[s.category] || '⚙️'}</span>
                </div>
                <div style={{ padding:14, background:'#0a0b0e' }}>
                  <div style={{ fontFamily:"'Orbitron',monospace", fontSize:8, fontWeight:700, letterSpacing:'.12em', color:'#e8390e', marginBottom:4 }}>{s.category.replace('_',' ').toUpperCase()}</div>
                  <div style={{ fontFamily:"'Rajdhani',sans-serif", fontSize:14, fontWeight:700, color:'#c0c0d0', marginBottom:4 }}>{s.name}</div>
                  <div style={{ fontSize:11, color:'#33333f', lineHeight:1.5, marginBottom:12 }}>{s.description}</div>
                  <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:12 }}>
                    <span style={{ fontFamily:"'Orbitron',monospace", fontSize:14, fontWeight:900, color:'#e8390e' }}>${s.basePrice.toFixed(2)}</span>
                    <span style={{ fontSize:9, color:'#2a2a36', fontFamily:"'Orbitron',monospace" }}>{s.estimatedHours}H EST</span>
                  </div>
                  <Link to={user ? '/book' : '/register'} className="btn btn-primary" style={{ width:'100%', justifyContent:'center' }}>
                    BOOK THIS SERVICE
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
        {!loading && services.length === 0 && (
          <div className="empty-state"><h3>No services found</h3><p>Try a different category</p></div>
        )}
      </div>
    </div>
  )
}
