import { useEffect, useState } from 'react'
import { vehiclesAPI } from '../api'
import toast from 'react-hot-toast'

const blank = { make:'', model:'', year:'', licensePlate:'', color:'', vin:'', mileage:'', fuelType:'petrol' }

export default function MyVehicles() {
  const [vehicles, setVehicles] = useState([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editing, setEditing] = useState(null)
  const [form, setForm] = useState(blank)
  const [saving, setSaving] = useState(false)

  useEffect(() => { vehiclesAPI.getAll().then(r=>setVehicles(r.data)).finally(()=>setLoading(false)) }, [])

  const openAdd = () => { setEditing(null); setForm(blank); setShowForm(true) }
  const openEdit = v => { setEditing(v._id); setForm({ make:v.make, model:v.model, year:v.year, licensePlate:v.licensePlate, color:v.color||'', vin:v.vin||'', mileage:v.mileage||'', fuelType:v.fuelType }); setShowForm(true) }

  const handleSave = async e => {
    e.preventDefault(); setSaving(true)
    try {
      if (editing) {
        const { data } = await vehiclesAPI.update(editing, form)
        setVehicles(p=>p.map(v=>v._id===editing?data:v))
        toast.success('Vehicle updated')
      } else {
        const { data } = await vehiclesAPI.create(form)
        setVehicles(p=>[...p,data])
        toast.success('Vehicle added')
      }
      setShowForm(false)
    } catch (err) { toast.error(err.response?.data?.message || 'Error') }
    finally { setSaving(false) }
  }

  const handleDelete = async id => {
    if (!confirm('Remove this vehicle?')) return
    try { await vehiclesAPI.remove(id); setVehicles(p=>p.filter(v=>v._id!==id)); toast.success('Removed') }
    catch { toast.error('Could not remove') }
  }

  const f = k => e => setForm({...form,[k]:e.target.value})
  const box = { background:'linear-gradient(160deg,#0e0f14,#0a0b0e)', border:'1px solid', borderRadius:9, padding:20 }

  return (
    <div style={{ padding:24, background:'#050608', minHeight:'calc(100vh - 58px)' }}>
      <div style={{ maxWidth:1000, margin:'0 auto' }}>
        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:20 }}>
          <div>
            <div style={{ fontFamily:"'Orbitron',monospace", fontSize:18, fontWeight:900, color:'#c0c0d0', letterSpacing:'.06em' }}>MY VEHICLES</div>
            <div style={{ fontSize:11, color:'#33333f', marginTop:3 }}>Manage your registered vehicles</div>
          </div>
          <button className="btn btn-primary btn-sm" onClick={openAdd}>+ ADD VEHICLE</button>
        </div>

        {showForm && (
          <form onSubmit={handleSave} style={{ ...box, borderColor:'#e8390e', marginBottom:20, position:'relative', overflow:'hidden' }}>
            <div style={{ position:'absolute', top:0, left:0, right:0, height:2, background:'#e8390e' }}/>
            <div style={{ fontFamily:"'Orbitron',monospace", fontSize:11, fontWeight:900, color:'#c0c0d0', marginBottom:16, letterSpacing:'.06em' }}>{editing?'EDIT VEHICLE':'ADD VEHICLE'}</div>
            <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(160px,1fr))', gap:12 }}>
              {[['make','Make *','Toyota'],['model','Model *','Camry'],['year','Year *','2021'],['licensePlate','Plate *','ABC 123'],['color','Colour','Silver'],['vin','VIN','Optional'],['mileage','Mileage (km)','50000']].map(([k,l,p])=>(
                <div key={k} className="form-group" style={{ marginBottom:0 }}>
                  <label className="form-label">{l}</label>
                  <input className="form-input" placeholder={p} value={form[k]} onChange={f(k)} required={l.includes('*')} />
                </div>
              ))}
              <div className="form-group" style={{ marginBottom:0 }}>
                <label className="form-label">Fuel Type</label>
                <select className="form-input" value={form.fuelType} onChange={f('fuelType')}>
                  {['petrol','diesel','electric','hybrid'].map(v=><option key={v} value={v}>{v.charAt(0).toUpperCase()+v.slice(1)}</option>)}
                </select>
              </div>
            </div>
            <div style={{ display:'flex', gap:8, marginTop:16 }}>
              <button type="submit" className="btn btn-primary btn-sm" disabled={saving}>{saving?'Saving...':editing?'UPDATE':'ADD VEHICLE'}</button>
              <button type="button" className="btn btn-ghost btn-sm" onClick={()=>setShowForm(false)}>Cancel</button>
            </div>
          </form>
        )}

        {loading ? <div className="loading"><div className="spinner"/></div> :
          vehicles.length===0 && !showForm ? (
            <div className="empty-state">
              <h3>No vehicles yet</h3>
              <p style={{ marginBottom:20 }}>Add your vehicle to book services</p>
              <button className="btn btn-primary" onClick={openAdd}>+ Add Vehicle</button>
            </div>
          ) : (
            <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(280px,1fr))', gap:16 }}>
              {vehicles.map(v=>(
                <div key={v._id} style={{ ...box, borderColor:'#1e2028', position:'relative', overflow:'hidden' }}>
                  <div style={{ position:'absolute', top:0, left:0, bottom:0, width:3, background:'#e8390e', borderRadius:'0 2px 2px 0' }}/>
                  <div style={{ display:'flex', alignItems:'center', gap:12, marginBottom:14, paddingLeft:8 }}>
                    <span style={{ fontSize:28 }}>🚗</span>
                    <div>
                      <div style={{ fontFamily:"'Rajdhani',sans-serif", fontSize:15, fontWeight:700, color:'#c0c0d0' }}>{v.year} {v.make} {v.model}</div>
                      <div style={{ fontFamily:"'Orbitron',monospace", fontSize:9, color:'#33333f', background:'#070809', padding:'2px 7px', borderRadius:3, marginTop:3, display:'inline-block', letterSpacing:'.06em' }}>{v.licensePlate}</div>
                    </div>
                  </div>
                  <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:8, marginBottom:14, background:'#070809', borderRadius:7, padding:10 }}>
                    {[['Colour',v.color||'—'],['Fuel',v.fuelType],['Mileage',v.mileage?v.mileage.toLocaleString()+' km':'—'],['VIN',v.vin||'—']].map(([l,val])=>(
                      <div key={l}>
                        <div style={{ fontSize:8, color:'#2a2a36', fontFamily:"'Orbitron',monospace", letterSpacing:'.08em', marginBottom:2 }}>{l}</div>
                        <div style={{ fontSize:12, fontWeight:600, color:'#555568', textTransform:'capitalize' }}>{val}</div>
                      </div>
                    ))}
                  </div>
                  <div style={{ display:'flex', gap:8 }}>
                    <button className="btn btn-ghost btn-sm" onClick={()=>openEdit(v)}>✏ Edit</button>
                    <button className="btn btn-danger btn-sm" onClick={()=>handleDelete(v._id)}>✕ Remove</button>
                  </div>
                </div>
              ))}
            </div>
          )}
      </div>
    </div>
  )
}
