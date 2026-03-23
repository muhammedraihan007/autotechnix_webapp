import { useState } from 'react'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { FiMenu, FiX, FiUser, FiLogOut, FiCalendar, FiTruck, FiFileText } from 'react-icons/fi'

export default function Navbar() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [open, setOpen] = useState(false)
  const [drop, setDrop] = useState(false)
  const handleLogout = () => { logout(); navigate('/'); setOpen(false) }

  const nav = { position:'sticky',top:0,zIndex:100,background:'rgba(7,8,10,.97)',borderBottom:'1px solid #1e2028',backdropFilter:'blur(20px)' }
  const inner = { maxWidth:1200,margin:'0 auto',padding:'0 24px',height:58,display:'flex',alignItems:'center',gap:12 }
  const logo = { fontFamily:"'Orbitron',monospace",fontSize:13,fontWeight:900,color:'#e8390e',letterSpacing:'.12em',cursor:'pointer',display:'flex',alignItems:'center',gap:8,textDecoration:'none' }
  const links = { display:'flex',gap:2,marginLeft:8,flex:1 }
  const nlBase = { padding:'5px 12px',borderRadius:6,fontSize:11,fontWeight:600,color:'#44445a',cursor:'pointer',transition:'all .18s',letterSpacing:'.03em',textDecoration:'none',display:'block' }

  return (
    <nav style={nav}>
      <div style={inner}>
        <Link to="/" style={logo}>
          <div style={{ width:24,height:24,borderRadius:'50%',border:'1.5px solid #e8390e',display:'flex',alignItems:'center',justifyContent:'center',fontSize:12,fontWeight:900 }}>A</div>
          AUTOTECHNIX
        </Link>
        <div style={links}>
          {[['/',  'Home'],  ['/services','Services'], ['/book','Book Now'], ['/bookings','My Bookings']].map(([to,label]) => (
            <NavLink key={to} to={to} end={to==='/'} onClick={()=>setOpen(false)}
              style={({isActive})=>({...nlBase,color:isActive?'#e8390e':'#44445a',background:isActive?'rgba(232,57,14,.08)':'transparent'})}>
              {label}
            </NavLink>
          ))}
        </div>
        <div style={{ display:'flex',gap:8,alignItems:'center',marginLeft:'auto' }}>
          {user ? (
            <div style={{ position:'relative' }}>
              <button onClick={()=>setDrop(!drop)} style={{ display:'flex',alignItems:'center',gap:8,background:'#0f1016',border:'1px solid #1e2028',borderRadius:8,padding:'6px 12px',color:'#eeeef2',cursor:'pointer' }}>
                <div style={{ width:26,height:26,borderRadius:'50%',background:'#e8390e',display:'flex',alignItems:'center',justifyContent:'center',fontSize:12,fontWeight:900,color:'#fff' }}>{user.name[0].toUpperCase()}</div>
                <span style={{ fontSize:13,fontWeight:600 }}>{user.name.split(' ')[0]}</span>
              </button>
              {drop && (
                <div onMouseLeave={()=>setDrop(false)} style={{ position:'absolute',top:'calc(100% + 8px)',right:0,background:'#0f1016',border:'1px solid #1e2028',borderRadius:10,padding:6,minWidth:180,zIndex:200 }}>
                  {[['/profile',<FiUser size={14}/>,'Profile'],['/bookings',<FiCalendar size={14}/>,'Bookings'],['/vehicles',<FiTruck size={14}/>,'Vehicles'],['/invoices',<FiFileText size={14}/>,'Invoices']].map(([to,icon,label])=>(
                    <Link key={to} to={to} onClick={()=>setDrop(false)} style={{ display:'flex',alignItems:'center',gap:10,padding:'9px 12px',borderRadius:6,fontSize:13,color:'#8888a0',textDecoration:'none',transition:'all .15s' }}
                      onMouseEnter={e=>e.currentTarget.style.background='#13141a'} onMouseLeave={e=>e.currentTarget.style.background='transparent'}>
                      {icon}{label}
                    </Link>
                  ))}
                  <div style={{ borderTop:'1px solid #1e2028',margin:'4px 0' }}/>
                  <button onClick={handleLogout} style={{ display:'flex',alignItems:'center',gap:10,width:'100%',padding:'9px 12px',borderRadius:6,fontSize:13,color:'#8888a0',background:'none',border:'none',cursor:'pointer',transition:'all .15s' }}
                    onMouseEnter={e=>e.currentTarget.style.background='#13141a'} onMouseLeave={e=>e.currentTarget.style.background='transparent'}>
                    <FiLogOut size={14}/>Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div style={{ display:'flex',gap:8 }}>
              <Link to="/login" className="btn btn-ghost btn-sm">Sign In</Link>
              <Link to="/register" className="btn btn-primary btn-sm">Sign Up</Link>
            </div>
          )}
          <button onClick={()=>setOpen(!open)} style={{ display:'none',background:'none',border:'none',color:'#eeeef2',padding:4,cursor:'pointer' }}>
            {open?<FiX size={22}/>:<FiMenu size={22}/>}
          </button>
        </div>
      </div>
    </nav>
  )
}
