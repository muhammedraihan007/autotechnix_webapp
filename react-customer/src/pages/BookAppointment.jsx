import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { servicesAPI, vehiclesAPI, bookingsAPI } from '../api'
import toast from 'react-hot-toast'

const TIMES = ['08:00','09:00','10:00','11:00','12:00','13:00','14:00','15:00','16:00']
const today = new Date().toISOString().split('T')[0]

export default function BookAppointment() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [step, setStep] = useState(0)
  const [services, setServices] = useState([])
  const [vehicles, setVehicles] = useState([])
  const [selSvcs, setSelSvcs] = useState([])
  const [selVeh, setSelVeh] = useState('')
  const [date, setDate] = useState('')
  const [time, setTime] = useState('')
  const [notes, setNotes] = useState('')
  const [loading, setLoading] = useState(false)
  const [showAddVeh, setShowAddVeh] = useState(false)
  const [newVeh, setNewVeh] = useState({ make:'', model:'', year:'', licensePlate:'', color:'', fuelType:'petrol' })

  useEffect(() => {
    Promise.all([servicesAPI.getAll(), vehiclesAPI.getAll()])
      .then(([sr, vr]) => { setServices(sr.data); setVehicles(vr.data) })
  }, [])

  const toggleSvc = id => setSelSvcs(p => p.includes(id) ? p.filter(s=>s!==id) : [...p,id])
  const total = services.filter(s=>selSvcs.includes(s._id)).reduce((a,s)=>a+s.basePrice,0)

  const addVehicle = async e => {
    e.preventDefault()
    try {
      const { data } = await vehiclesAPI.create(newVeh)
      setVehicles(p=>[...p,data]); setSelVeh(data._id); setShowAddVeh(false)
      setNewVeh({ make:'', model:'', year:'', licensePlate:'', color:'', fuelType:'petrol' })
      toast.success('Vehicle added!')
    } catch (err) { toast.error(err.response?.data?.message || 'Error') }
  }

  const confirm = async () => {
    if (!selVeh) return toast.error('Select a vehicle')
    if (!selSvcs.length) return toast.error('Select at least one service')
    if (!date || !time) return toast.error('Select date and time')
    setLoading(true)
    try {
      await bookingsAPI.create({ vehicle:selVeh, services:selSvcs, scheduledDate:date, scheduledTime:time, customerNotes:notes })
      toast.success('Booking confirmed!')
      navigate('/bookings')
    } catch (err) { toast.error(err.response?.data?.message || 'Booking failed') }
    finally { setLoading(false) }
  }

  const box = { background:'linear-gradient(160deg,#0e0f14,#0a0b0e)', border:'1px solid #1e2028', borderRadius:9, padding:18, marginBottom:12, position:'relative', overflow:'hidden' }
  const boxTitle = { fontFamily:"'Orbitron',monospace", fontSize:8, fontWeight:700, color:'#2a2a36', letterSpacing:'.16em', marginBottom:12, display:'flex', alignItems:'center', gap:6 }
  const stepBtn = i => ({ flex:1, padding:'9px 6px', textAlign:'center', fontSize:9, fontWeight:700, cursor:'pointer', borderBottom:'2px solid', borderTop:'none', borderLeft:'none', borderRight:'none', background:'none', letterSpacing:'.06em', color: step===i?'#e8390e':step>i?'#22c55e':'#2a2a36', borderBottomColor: step===i?'#e8390e':step>i?'#22c55e':'#1e2028', transition:'all .2s' })

  return (
    <div style={{ padding:24, background:'#050608', minHeight:'calc(100vh - 58px)' }}>
      <div style={{ maxWidth:860, margin:'0 auto' }}>
        <div style={{ fontFamily:"'Orbitron',monospace", fontSize:18, fontWeight:900, color:'#c0c0d0', letterSpacing:'.07em', marginBottom:4 }}>BOOK APPOINTMENT</div>
        <div style={{ fontSize:11, color:'#33333f', marginBottom:20 }}>Select services, vehicle and preferred time</div>

        <div style={{ display:'flex', background:'repeating-linear-gradient(45deg,rgba(255,255,255,.008) 0,rgba(255,255,255,.008) 1px,transparent 0,transparent 6px),#0d0e12', backgroundSize:'6px 6px,100%', border:'1px solid #1e2028', borderRadius:8, overflow:'hidden', marginBottom:22 }}>
          {['Services','Vehicle','Date & Time','Confirm'].map((s,i) => (
            <button key={s} style={stepBtn(i)} onClick={()=>i<step&&setStep(i)}>{i<step?'✓ ':''}{s.toUpperCase()}</button>
          ))}
        </div>

        {/* STEP 0 - SERVICES */}
        {step===0 && (
          <div>
            <div style={box}>
              <div style={boxTitle}><div style={{ width:2, height:10, background:'#e8390e', borderRadius:1 }}/>SELECT SERVICES</div>
              <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:8 }}>
                {services.map(s => (
                  <div key={s._id} onClick={()=>toggleSvc(s._id)}
                    style={{ background: selSvcs.includes(s._id)?'rgba(232,57,14,.07)':'#070809', border:'2px solid', borderColor:selSvcs.includes(s._id)?'#e8390e':'#141618', borderRadius:9, padding:12, cursor:'pointer', transition:'all .2s', position:'relative' }}>
                    <div style={{ position:'absolute', top:7, right:7, width:16, height:16, borderRadius:'50%', background:selSvcs.includes(s._id)?'#e8390e':'#141618', display:'flex', alignItems:'center', justifyContent:'center', fontSize:9, color:selSvcs.includes(s._id)?'#fff':'transparent' }}>✓</div>
                    <div style={{ fontSize:12, fontWeight:700, color:'#888890', marginBottom:3, fontFamily:"'Rajdhani',sans-serif" }}>{s.name}</div>
                    <div style={{ fontFamily:"'Orbitron',monospace", fontSize:13, color:'#e8390e', fontWeight:700 }}>${s.basePrice.toFixed(2)}</div>
                  </div>
                ))}
              </div>
              {selSvcs.length > 0 && (
                <div style={{ background:'rgba(232,57,14,.07)', border:'1px solid rgba(232,57,14,.2)', borderRadius:7, padding:'10px 14px', marginTop:12, display:'flex', justifyContent:'space-between', fontSize:12 }}>
                  <span style={{ color:'#555568' }}>{selSvcs.length} service{selSvcs.length>1?'s':''} selected</span>
                  <strong style={{ fontFamily:"'Orbitron',monospace", color:'#e8390e' }}>${total.toFixed(2)}</strong>
                </div>
              )}
            </div>
            <div style={{ display:'flex', gap:10 }}>
              <button className="btn btn-primary" disabled={!selSvcs.length} onClick={()=>setStep(1)}>NEXT: VEHICLE →</button>
            </div>
          </div>
        )}

        {/* STEP 1 - VEHICLE */}
        {step===1 && (
          <div>
            <div style={box}>
              <div style={boxTitle}><div style={{ width:2, height:10, background:'#e8390e', borderRadius:1 }}/>YOUR VEHICLE</div>
              <div style={{ display:'grid', gridTemplateColumns:'repeat(2,1fr)', gap:8, marginBottom:12 }}>
                {vehicles.map(v => (
                  <div key={v._id} onClick={()=>setSelVeh(v._id)}
                    style={{ background:selVeh===v._id?'rgba(232,57,14,.06)':'#070809', border:'2px solid', borderColor:selVeh===v._id?'#e8390e':'#141618', borderRadius:9, padding:13, cursor:'pointer', display:'flex', alignItems:'center', gap:10, transition:'all .2s', position:'relative' }}>
                    <div style={{ position:'absolute', left:0, top:8, bottom:8, width:2, background:selVeh===v._id?'#e8390e':'#141618', borderRadius:'0 1px 1px 0', transition:'background .2s' }}/>
                    <span style={{ fontSize:22 }}>🚗</span>
                    <div>
                      <div style={{ fontSize:12, fontWeight:700, color:'#888890', fontFamily:"'Rajdhani',sans-serif" }}>{v.year} {v.make} {v.model}</div>
                      <div style={{ fontFamily:"'Orbitron',monospace", fontSize:9, color:'#33333f', background:'#0a0b0e', padding:'2px 6px', borderRadius:3, marginTop:2, display:'inline-block', letterSpacing:'.06em' }}>{v.licensePlate}</div>
                    </div>
                  </div>
                ))}
              </div>
              {!showAddVeh ? (
                <button className="btn btn-outline btn-sm" onClick={()=>setShowAddVeh(true)}>+ Add Vehicle</button>
              ) : (
                <form onSubmit={addVehicle} style={{ background:'#070809', border:'1px solid #1e2028', borderRadius:8, padding:16, marginTop:8 }}>
                  <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:10, marginBottom:12 }}>
                    {[['make','Make *','Toyota'],['model','Model *','Camry'],['year','Year *','2021'],['licensePlate','Plate *','ABC 123'],['color','Colour','Silver']].map(([k,l,p])=>(
                      <div key={k} className="form-group" style={{ marginBottom:0 }}>
                        <label className="form-label">{l}</label>
                        <input className="form-input" placeholder={p} value={newVeh[k]} onChange={e=>setNewVeh({...newVeh,[k]:e.target.value})} required={l.includes('*')} />
                      </div>
                    ))}
                    <div className="form-group" style={{ marginBottom:0 }}>
                      <label className="form-label">Fuel Type</label>
                      <select className="form-input" value={newVeh.fuelType} onChange={e=>setNewVeh({...newVeh,fuelType:e.target.value})}>
                        {['petrol','diesel','electric','hybrid'].map(f=><option key={f} value={f}>{f}</option>)}
                      </select>
                    </div>
                  </div>
                  <div style={{ display:'flex', gap:8 }}>
                    <button type="submit" className="btn btn-primary btn-sm">Save Vehicle</button>
                    <button type="button" className="btn btn-ghost btn-sm" onClick={()=>setShowAddVeh(false)}>Cancel</button>
                  </div>
                </form>
              )}
            </div>
            <div style={{ display:'flex', gap:10 }}>
              <button className="btn btn-outline" onClick={()=>setStep(0)}>← BACK</button>
              <button className="btn btn-primary" disabled={!selVeh} onClick={()=>setStep(2)}>NEXT: DATE & TIME →</button>
            </div>
          </div>
        )}

        {/* STEP 2 - DATE & TIME */}
        {step===2 && (
          <div>
            <div style={box}>
              <div style={boxTitle}><div style={{ width:2, height:10, background:'#e8390e', borderRadius:1 }}/>SELECT DATE</div>
              <input className="form-input" type="date" min={today} value={date} onChange={e=>setDate(e.target.value)} style={{ maxWidth:220 }} />
            </div>
            {date && (
              <div style={box}>
                <div style={boxTitle}><div style={{ width:2, height:10, background:'#e8390e', borderRadius:1 }}/>TIME SLOT</div>
                <div style={{ display:'flex', flexWrap:'wrap', gap:7 }}>
                  {TIMES.map(t => (
                    <button key={t} onClick={()=>setTime(t)}
                      style={{ background:time===t?'#e8390e':'#070809', border:'2px solid', borderColor:time===t?'#e8390e':'#141618', color:time===t?'#fff':'#33333f', padding:'7px 14px', borderRadius:7, fontSize:11, fontWeight:700, cursor:'pointer', transition:'all .2s', fontFamily:"'Orbitron',monospace", letterSpacing:'.04em' }}>
                      {t}
                    </button>
                  ))}
                </div>
              </div>
            )}
            <div style={box}>
              <div style={boxTitle}><div style={{ width:2, height:10, background:'#e8390e', borderRadius:1 }}/>NOTES (OPTIONAL)</div>
              <textarea className="form-input" rows={3} placeholder="Any specific concerns or requests..." value={notes} onChange={e=>setNotes(e.target.value)} />
            </div>
            <div style={{ display:'flex', gap:10 }}>
              <button className="btn btn-outline" onClick={()=>setStep(1)}>← BACK</button>
              <button className="btn btn-primary" disabled={!date||!time} onClick={()=>setStep(3)}>REVIEW →</button>
            </div>
          </div>
        )}

        {/* STEP 3 - CONFIRM */}
        {step===3 && (
          <div>
            <div style={box}>
              <div style={boxTitle}><div style={{ width:2, height:10, background:'#e8390e', borderRadius:1 }}/>BOOKING SUMMARY</div>
              {services.filter(s=>selSvcs.includes(s._id)).map(s=>(
                <div key={s._id} style={{ display:'flex', justifyContent:'space-between', padding:'6px 0', borderBottom:'1px solid #0f1014', fontSize:12, color:'#33333f' }}>
                  <span>{s.name}</span><span>${s.basePrice.toFixed(2)}</span>
                </div>
              ))}
              <div style={{ display:'flex', justifyContent:'space-between', paddingTop:10, fontSize:14, fontWeight:700, color:'#c0c0d0' }}>
                <span>ESTIMATED TOTAL</span>
                <span style={{ fontFamily:"'Orbitron',monospace", color:'#e8390e' }}>${total.toFixed(2)}</span>
              </div>
            </div>
            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:12, marginBottom:4 }}>
              <div style={box}>
                <div style={boxTitle}><div style={{ width:2, height:10, background:'#e8390e', borderRadius:1 }}/>VEHICLE</div>
                {(() => { const v=vehicles.find(v=>v._id===selVeh); return v?<><div style={{ fontFamily:"'Rajdhani',sans-serif", fontSize:13, fontWeight:700, color:'#888890' }}>{v.year} {v.make} {v.model}</div><div style={{ fontFamily:"'Orbitron',monospace", fontSize:9, color:'#2a2a36', marginTop:3 }}>{v.licensePlate}</div></>:null })()}
              </div>
              <div style={box}>
                <div style={boxTitle}><div style={{ width:2, height:10, background:'#e8390e', borderRadius:1 }}/>SCHEDULE</div>
                <div style={{ fontFamily:"'Rajdhani',sans-serif", fontSize:13, fontWeight:700, color:'#888890' }}>{new Date(date+'T12:00:00').toLocaleDateString('en-US',{weekday:'long',month:'long',day:'numeric'})}</div>
                <div style={{ fontFamily:"'Orbitron',monospace", fontSize:10, color:'#2a2a36', marginTop:3 }}>{time}</div>
              </div>
            </div>
            <div style={{ display:'flex', gap:10 }}>
              <button className="btn btn-outline" onClick={()=>setStep(2)}>← BACK</button>
              <button className="btn btn-primary btn-lg" disabled={loading} onClick={confirm}>
                {loading?'BOOKING...':'✓ CONFIRM BOOKING'}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
