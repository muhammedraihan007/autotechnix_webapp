import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const services = [
  { emoji:'🔧', name:'Oil Change', price:'$49.99' },
  { emoji:'🛞', name:'Tyres', price:'$39.99' },
  { emoji:'🔴', name:'Brakes', price:'$149.99' },
  { emoji:'❄️', name:'AC Service', price:'$89.99' },
  { emoji:'🔍', name:'Diagnostics', price:'$69.99' },
  { emoji:'🔋', name:'Battery', price:'$99.99' },
  { emoji:'🎯', name:'Alignment', price:'$59.99' },
  { emoji:'🔎', name:'Inspection', price:'$79.99' },
]

const cards = [
  { emoji:'🔧', cat:'Oil Change', name:'Oil & Filter Change', desc:'Full synthetic oil with new filter. 21-point inspection included.', price:'$49.99', time:'1h' },
  { emoji:'🔴', cat:'Brakes', name:'Brake Pad Replacement', desc:'Front or rear pads with rotor inspection and brake fluid check.', price:'$149.99', time:'2h' },
  { emoji:'❄️', cat:'AC', name:'AC Regas & Service', desc:'System check, leak test, and full refrigerant recharge.', price:'$89.99', time:'1.5h' },
]

export default function Home() {
  const { user } = useAuth()
  return (
    <div>
      {/* HERO */}
      <div style={{ position:'relative', overflow:'hidden', borderBottom:'1px solid #1e2028' }}>
        <div style={{ position:'absolute', inset:0, backgroundImage:'repeating-linear-gradient(45deg,rgba(255,255,255,.012) 0,rgba(255,255,255,.012) 1px,transparent 0,transparent 50%),repeating-linear-gradient(-45deg,rgba(255,255,255,.012) 0,rgba(255,255,255,.012) 1px,transparent 0,transparent 50%),radial-gradient(ellipse 120% 90% at 70% 50%,rgba(232,57,14,.09) 0%,transparent 65%)', backgroundSize:'6px 6px,6px 6px,100% 100%' }} />
        <div style={{ position:'absolute', top:0, bottom:0, width:'50%', background:'linear-gradient(90deg,transparent,rgba(232,57,14,.025),transparent)', animation:'scanline 3s ease-in-out infinite', pointerEvents:'none' }} />
        <div style={{ position:'absolute', bottom:0, left:0, right:0, height:4, background:'repeating-linear-gradient(90deg,#e8390e 0,#e8390e 20px,transparent 20px,transparent 40px)', opacity:.18 }} />
        <div style={{ position:'relative', zIndex:2, padding:'52px 28px 38px', maxWidth:1200, margin:'0 auto', display:'flex', alignItems:'center', gap:40 }}>
          <div style={{ flex:1 }}>
            <div style={{ display:'inline-flex', alignItems:'center', gap:7, background:'rgba(232,57,14,.08)', border:'1px solid rgba(232,57,14,.22)', color:'#e8390e', padding:'4px 13px', borderRadius:20, fontSize:10, fontWeight:700, marginBottom:18, letterSpacing:'.08em' }}>
              <div style={{ width:5, height:5, borderRadius:'50%', background:'#e8390e', animation:'pulse 1.2s ease infinite' }} />
              WORKSHOP OPEN — BOOK TODAY
            </div>
            <h1 style={{ fontFamily:"'Orbitron',monospace", fontSize:'clamp(22px,3.5vw,38px)', fontWeight:900, lineHeight:1.1, marginBottom:12, letterSpacing:'.04em' }}>
              PRECISION<br/><span style={{ color:'#e8390e' }}>AUTO CARE</span>
            </h1>
            <p style={{ fontSize:13, color:'#555568', lineHeight:1.7, marginBottom:22, maxWidth:380 }}>
              Expert diagnostics, servicing and repairs. Book your bay in under 2 minutes.
            </p>
            <div style={{ display:'flex', gap:10, marginBottom:28, flexWrap:'wrap' }}>
              <Link to={user?'/book':'/register'} className="btn btn-primary btn-lg">Book Appointment</Link>
              <Link to="/services" className="btn btn-outline btn-lg">View Services</Link>
            </div>
            <div style={{ display:'flex', gap:0 }}>
              {[['5K+','Customers'],['15+','Years exp.'],['98%','Satisfaction']].map(([n,l],i)=>(
                <div key={l} style={{ padding:'0 20px', borderRight: i<2?'1px solid #1e2028':'none', paddingLeft: i===0?0:20 }}>
                  <div style={{ fontFamily:"'Orbitron',monospace", fontSize:22, fontWeight:900, color:'#eeeef2', lineHeight:1 }}><span style={{ color:'#e8390e' }}>{n}</span></div>
                  <div style={{ fontSize:9, color:'#33333f', letterSpacing:'.08em', marginTop:3 }}>{l}</div>
                </div>
              ))}
            </div>
          </div>
          {/* Mini dashboard panel */}
          <div style={{ width:240, flexShrink:0, background:'radial-gradient(ellipse at 50% 30%,#1c1a20 0%,#0f0e12 50%,#0a090c 100%)', border:'1px solid #1e1e28', borderRadius:12, padding:18, position:'relative', overflow:'hidden' }}>
            <div style={{ position:'absolute', inset:0, backgroundImage:'repeating-linear-gradient(45deg,rgba(255,255,255,.008) 0,rgba(255,255,255,.008) 1px,transparent 0,transparent 6px),repeating-linear-gradient(-45deg,rgba(255,255,255,.008) 0,rgba(255,255,255,.008) 1px,transparent 0,transparent 6px)', backgroundSize:'6px 6px' }} />
            <div style={{ position:'relative', zIndex:1 }}>
              <div style={{ fontFamily:"'Orbitron',monospace", fontSize:8, color:'#2a2a36', letterSpacing:'.2em', textAlign:'center', marginBottom:14 }}>VEHICLE TELEMETRY</div>
              <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:8 }}>
                {[['ENGINE','82°C','#3b82f6',62],['OIL','4.2 bar','#f59e0b',75],['FUEL','68%','#22c55e',68],['VOLTS','12.6V','#a855f7',88]].map(([l,v,c,w])=>(
                  <div key={l} style={{ background:'rgba(0,0,0,.4)', border:'1px solid #151518', borderRadius:5, padding:'7px 8px' }}>
                    <div style={{ fontFamily:"'Orbitron',monospace", fontSize:7, color:'#2a2a36', letterSpacing:'.14em', marginBottom:4 }}>{l}</div>
                    <div style={{ height:3, background:'#0a0a0e', borderRadius:2, overflow:'hidden', marginBottom:3 }}>
                      <div style={{ height:'100%', width:w+'%', background:c, borderRadius:2 }} />
                    </div>
                    <div style={{ fontFamily:"'Orbitron',monospace", fontSize:11, fontWeight:700, color:'#c0c0d0' }}>{v}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* SERVICE STRIP */}
      <div style={{ borderTop:'1px solid #1e2028', padding:'16px 24px', background:'#0d0e12', display:'flex', gap:10, overflowX:'auto' }}>
        {services.map(s=>(
          <Link key={s.name} to={user?'/book':'/register'} style={{ background:'#0f1016', border:'1px solid #1e2028', borderLeft:'3px solid #e8390e', borderRadius:9, padding:'11px 14px', display:'flex', alignItems:'center', gap:10, flexShrink:0, textDecoration:'none', transition:'all .2s' }}
            onMouseEnter={e=>{e.currentTarget.style.transform='translateY(-2px)';e.currentTarget.style.borderColor='#e8390e'}}
            onMouseLeave={e=>{e.currentTarget.style.transform='none';e.currentTarget.style.borderLeftColor='#e8390e';e.currentTarget.style.borderTopColor='#1e2028';e.currentTarget.style.borderRightColor='#1e2028';e.currentTarget.style.borderBottomColor='#1e2028'}}>
            <span style={{ fontSize:18 }}>{s.emoji}</span>
            <div>
              <div style={{ fontSize:11, fontWeight:700, color:'#888890' }}>{s.name}</div>
              <div style={{ fontFamily:"'Orbitron',monospace", fontSize:10, color:'#e8390e', fontWeight:700, marginTop:1 }}>{s.price}</div>
            </div>
          </Link>
        ))}
      </div>

      {/* SERVICE CARDS */}
      <div style={{ padding:'24px', background:'#050608' }}>
        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:18 }}>
          <div style={{ fontFamily:"'Orbitron',monospace", fontSize:14, fontWeight:900, color:'#c0c0d0', letterSpacing:'.08em' }}>POPULAR <span style={{ color:'#e8390e' }}>SERVICES</span></div>
          <Link to="/services" className="btn btn-outline btn-sm">View All</Link>
        </div>
        <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:12 }}>
          {cards.map((c,i)=>(
            <Link key={c.name} to={user?'/book':'/register'} style={{ borderRadius:10, overflow:'hidden', border:'1px solid #1e2028', textDecoration:'none', display:'block', transition:'all .22s', animationDelay: i*.08+'s' }}
              onMouseEnter={e=>{e.currentTarget.style.transform='translateY(-4px)';e.currentTarget.style.borderColor='#2a2c38'}}
              onMouseLeave={e=>{e.currentTarget.style.transform='none';e.currentTarget.style.borderColor='#1e2028'}}>
              <div style={{ height:76, background:['linear-gradient(135deg,#1a1208,#2a2010,#1c1508)','linear-gradient(135deg,#0a0e1a,#101828,#0c1420)','linear-gradient(135deg,#100a0a,#1e0e0e,#160a0a)'][i], display:'flex', alignItems:'center', justifyContent:'center', fontSize:28, position:'relative' }}>
                <div style={{ position:'absolute', inset:0, background:'repeating-linear-gradient(82deg,rgba(255,255,255,0) 0%,rgba(255,255,255,.04) 1px,rgba(255,255,255,0) 2px,rgba(255,255,255,0) 6px)' }} />
                <span style={{ position:'relative', zIndex:1 }}>{c.emoji}</span>
              </div>
              <div style={{ padding:13, background:'#0a0b0e' }}>
                <div style={{ fontFamily:"'Orbitron',monospace", fontSize:8, fontWeight:700, letterSpacing:'.12em', color:'#e8390e', marginBottom:4 }}>{c.cat}</div>
                <div style={{ fontFamily:"'Rajdhani',sans-serif", fontSize:13, fontWeight:700, color:'#c0c0d0', marginBottom:3 }}>{c.name}</div>
                <div style={{ fontSize:10, color:'#33333f', lineHeight:1.5, marginBottom:10 }}>{c.desc}</div>
                <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center' }}>
                  <span style={{ fontFamily:"'Orbitron',monospace", fontSize:13, fontWeight:900, color:'#e8390e' }}>{c.price}</span>
                  <span style={{ fontSize:9, color:'#2a2a36', fontFamily:"'Orbitron',monospace" }}>{c.time} EST</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}
