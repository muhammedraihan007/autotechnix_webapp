import { Outlet, NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const NAV = [
  { to:'/', label:'Dashboard', icon:'⊞', end:true },
  { to:'/bookings', label:'Bookings', icon:'📅' },
  { to:'/services', label:'Services', icon:'🔧' },
  { to:'/customers', label:'Customers', icon:'👥' },
  { to:'/invoices', label:'Invoices', icon:'📄' },
]

export default function Layout() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const handleLogout = () => { logout(); navigate('/login') }

  return (
    <div style={{ display:'flex', minHeight:'100vh' }}>
      <aside style={{ width:'var(--sidebar)', background:'#070809', borderRight:'1px solid #1e2028', display:'flex', flexDirection:'column', position:'fixed', top:0, left:0, bottom:0, zIndex:50 }}>
        <div style={{ padding:16, fontFamily:"'Orbitron',monospace", fontSize:12, fontWeight:900, color:'#e8390e', letterSpacing:'.1em', borderBottom:'1px solid #1e2028', display:'flex', alignItems:'center', gap:7 }}>
          <div style={{ width:22, height:22, borderRadius:'50%', border:'1.5px solid #e8390e', display:'flex', alignItems:'center', justifyContent:'center', fontSize:11, fontWeight:900 }}>A</div>
          AUTOTECHNIX
        </div>
        <div style={{ padding:'12px 16px 8px', fontFamily:"'Orbitron',monospace", fontSize:7, color:'#1e1e28', letterSpacing:'.18em' }}>MAIN MENU</div>
        <nav style={{ padding:'0 8px', flex:1 }}>
          {NAV.map(n => (
            <NavLink key={n.to} to={n.to} end={n.end}
              style={({ isActive }) => ({
                display:'flex',
                alignItems:'center',
                gap:9,
                padding:'9px 10px',
                fontSize:12,
                fontWeight:500,
                color: isActive ? '#e8390e' : '#33333f',
                background: isActive ? 'rgba(232,57,14,.1)' : 'transparent',
                marginBottom:2,
                transition:'all .18s',
                borderLeft: isActive ? '2px solid #e8390e' : '2px solid transparent',
                borderRadius:'0 7px 7px 0',
                textDecoration:'none'
              })}>
              <span style={{ fontSize:14 }}>{n.icon}</span>{n.label}
            </NavLink>
          ))}
        </nav>
        <div style={{ borderTop:'1px solid #1e2028', padding:12, display:'flex', alignItems:'center', gap:10 }}>
          <div style={{ width:30, height:30, borderRadius:'50%', background:'radial-gradient(circle at 40% 35%,#2a2a36,#0f0f14)', border:'1.5px solid #e8390e', display:'flex', alignItems:'center', justifyContent:'center', fontFamily:"'Orbitron',monospace", fontSize:11, fontWeight:900, color:'#e8390e', flexShrink:0 }}>
            {user?.name?.[0]?.toUpperCase()}
          </div>
          <div style={{ flex:1, minWidth:0 }}>
            <div style={{ fontSize:12, fontWeight:600, color:'#555568', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{user?.name}</div>
            <div style={{ fontFamily:"'Orbitron',monospace", fontSize:7, color:'#1e1e28', letterSpacing:'.1em' }}>ADMINISTRATOR</div>
          </div>
          <button onClick={handleLogout} style={{ background:'none', border:'1px solid #1e2028', borderRadius:6, padding:'5px 7px', color:'#33333f', cursor:'pointer', fontSize:12, transition:'all .2s' }}
            onMouseEnter={e=>{ e.currentTarget.style.borderColor='#ef4444'; e.currentTarget.style.color='#ef4444' }}
            onMouseLeave={e=>{ e.currentTarget.style.borderColor='#1e2028'; e.currentTarget.style.color='#33333f' }}>
            ⏻
          </button>
        </div>
      </aside>
      <main style={{ marginLeft:'var(--sidebar)', flex:1, padding:28, minHeight:'100vh', background:'#050608' }}>
        <Outlet />
      </main>
    </div>
  )
}
