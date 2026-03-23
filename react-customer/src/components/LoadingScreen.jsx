import { useEffect, useRef, useState } from 'react'

export default function LoadingScreen({ onDone }) {
  const spdRef = useRef(null)
  const rpmRef = useRef(null)
  const fillRef = useRef(null)
  const [hiding, setHiding] = useState(false)

  useEffect(() => {
    let spd = 0, rpm = 0, pct = 0
    const si = setInterval(() => { spd = Math.min(spd + 3, 142); if (spdRef.current) spdRef.current.textContent = Math.round(spd); if (spd >= 142) clearInterval(si) }, 50)
    const ri = setInterval(() => { rpm = Math.min(rpm + 80, 3800); if (rpmRef.current) rpmRef.current.textContent = (Math.round(rpm / 100) / 10).toFixed(1); if (rpm >= 3800) clearInterval(ri) }, 40)
    const pi = setInterval(() => { pct = Math.min(pct + 2, 100); if (fillRef.current) fillRef.current.style.width = pct + '%'; if (pct >= 100) clearInterval(pi) }, 70)
    const t = setTimeout(() => { setHiding(true); setTimeout(onDone, 600) }, 4000)
    return () => { clearInterval(si); clearInterval(ri); clearInterval(pi); clearTimeout(t) }
  }, [onDone])

  return (
    <div style={{ position: 'fixed', inset: 0, background: '#07080a', zIndex: 9999, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 28, transition: 'opacity .6s', opacity: hiding ? 0 : 1 }}>
      <div style={{ position: 'absolute', inset: 0, backgroundImage: 'repeating-linear-gradient(45deg,rgba(255,255,255,.012) 0,rgba(255,255,255,.012) 1px,transparent 0,transparent 50%),repeating-linear-gradient(-45deg,rgba(255,255,255,.012) 0,rgba(255,255,255,.012) 1px,transparent 0,transparent 50%)', backgroundSize: '6px 6px' }} />
      <div style={{ display: 'flex', gap: 32, alignItems: 'center', position: 'relative', zIndex: 1 }}>
        <GaugeSVG color="#e8390e" label="km/h" valRef={spdRef} initVal="0" />
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10 }}>
          <div style={{ fontFamily: "'Orbitron',monospace", fontSize: 20, fontWeight: 900, color: '#e8390e', letterSpacing: '.12em' }}>AUTOTECHNIX</div>
          <div style={{ fontFamily: "'Orbitron',monospace", fontSize: 9, color: '#33333f', letterSpacing: '.22em' }}>PRECISION AUTO CARE</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 6 }}>
            <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#e8390e', animation: 'pulse 1.2s ease infinite' }} />
            <div style={{ fontFamily: "'Orbitron',monospace", fontSize: 9, color: '#8888a0', letterSpacing: '.12em' }}>INITIALISING SYSTEMS</div>
          </div>
          <div style={{ width: 240, height: 3, background: '#1e2028', borderRadius: 2, overflow: 'hidden' }}>
            <div ref={fillRef} style={{ height: '100%', background: 'linear-gradient(90deg,#c0300b,#e8390e)', borderRadius: 2, width: 0, transition: 'width .1s linear' }} />
          </div>
          <div style={{ display: 'flex', gap: 24 }}>
            {[['FUEL','72%','#22c55e'],['TEMP','45%','#3b82f6'],['OIL','88%','#f59e0b']].map(([l,w,c]) => (
              <div key={l} style={{ textAlign: 'center' }}>
                <div style={{ fontFamily: "'Orbitron',monospace", fontSize: 8, color: '#33333f', letterSpacing: '.1em', marginBottom: 4 }}>{l}</div>
                <div style={{ width: 72, height: 4, background: '#1e2028', borderRadius: 2, overflow: 'hidden' }}>
                  <div style={{ height: '100%', width: w, background: c, borderRadius: 2, transition: 'width 1s ease' }} />
                </div>
              </div>
            ))}
          </div>
        </div>
        <GaugeSVG color="#fbbf24" label="RPM ×1000" valRef={rpmRef} initVal="0" rpm />
      </div>
      <div style={{ display: 'flex', gap: 8, position: 'relative', zIndex: 1 }}>
        {['#ef4444','#f59e0b','#3b82f6','#22c55e','#e8390e','#a855f7','#22c55e'].map((c, i) => (
          <div key={i} style={{ width: 9, height: 9, borderRadius: '50%', background: c, opacity: i === 1 || i === 4 ? 1 : 0.15, animation: i === 1 || i === 4 ? 'pulse 1.2s ease infinite' : 'none' }} />
        ))}
      </div>
    </div>
  )
}

function GaugeSVG({ color, label, valRef, rpm }) {
  const anim = rpm ? 'rpmSweep 2.4s cubic-bezier(.4,0,.2,1) forwards' : 'needleSweep 2.8s cubic-bezier(.4,0,.2,1) forwards'
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
      <div style={{ width: 180, height: 180, borderRadius: '50%', background: 'radial-gradient(circle at 35% 35%,#2a2a2e 0%,#141416 40%,#0a0a0c 100%)', border: '3px solid #1e1e24', boxShadow: 'inset 0 2px 4px rgba(255,255,255,.06),0 8px 32px rgba(0,0,0,.9)', position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <svg width="160" height="160" viewBox="0 0 200 200" style={{ position: 'absolute' }}>
          <circle cx="100" cy="100" r="85" fill="none" stroke="#1e1e28" strokeWidth="6" />
          <path d={rpm ? "M 22 148 A 82 82 0 0 1 108 20" : "M 22 148 A 82 82 0 0 1 85 20"} fill="none" stroke={color} strokeWidth="6" strokeLinecap="round" opacity=".6" />
          {[...Array(9)].map((_, i) => {
            const a = (-130 + i * (260/8)) * Math.PI / 180
            const r1 = 72, r2 = 80
            return <line key={i} x1={100 + r1 * Math.sin(a)} y1={100 - r1 * Math.cos(a)} x2={100 + r2 * Math.sin(a)} y2={100 - r2 * Math.cos(a)} stroke="#1e1e28" strokeWidth="1.5" />
          })}
          <g style={{ transformOrigin: '100px 158px', animation: anim }}>
            <polygon points="100,28 97,156 103,156" fill={color} opacity=".95" />
            <circle cx="100" cy="158" r="8" fill="#141416" stroke={color} strokeWidth="2" />
            <circle cx="100" cy="158" r="3" fill={color} opacity=".7" />
          </g>
          <text x="100" y="132" textAnchor="middle" fill="#1e1e28" fontSize="7" fontFamily="Orbitron,monospace" letterSpacing="1">{label}</text>
          <text ref={valRef} x="100" y="115" textAnchor="middle" fill={color} fontSize="18" fontFamily="Orbitron,monospace" fontWeight="900">0</text>
        </svg>
      </div>
    </div>
  )
}
