import Navbar from "@/components/Navbar";
import StarsCanvas from "@/components/StarsCanvas";
import { motion } from "framer-motion";
import { useState } from "react";

const satellites = [
  { id:"SAT-2847", operator:"Starlink", orbit:"LEO 550km", status:"Nominal", risk:12 },
  { id:"SAT-9123", operator:"OneWeb", orbit:"LEO 1200km", status:"Monitor", risk:47 },
  { id:"SAT-0381", operator:"Iridium", orbit:"LEO 780km", status:"Nominal", risk:8 },
  { id:"SAT-5502", operator:"Telesat", orbit:"GEO 35786km", status:"Alert", risk:83 },
  { id:"DEB-4921", operator:"Debris", orbit:"LEO 620km", status:"Critical", risk:92 },
];

function RiskBar({ val }: { val: number }) {
  const color = val > 75 ? "#ef4444" : val > 40 ? "#f59e0b" : "#22c55e";
  return (
    <div className="flex items-center gap-3">
      <div className="flex-1 h-1.5 rounded-full bg-white/10 overflow-hidden">
        <motion.div initial={{ width: 0 }} whileInView={{ width: `${val}%` }} viewport={{ once: true }} transition={{ duration: 1, ease: "easeOut", delay: 0.3 }} className="h-full rounded-full" style={{ background: color, boxShadow: `0 0 8px ${color}` }} />
      </div>
      <span className="text-xs font-mono w-8 text-right" style={{ color }}>{val}</span>
    </div>
  );
}

function Widget({ title, children, className = "" }: { title: string; children: React.ReactNode; className?: string }) {
  return (
    <div className={`rounded-2xl p-6 ${className}`} style={{ background: "rgba(255,255,255,0.025)", border: "1px solid rgba(255,255,255,0.08)", backdropFilter: "blur(12px)" }}>
      <div className="flex items-center justify-between mb-5">
        <span className="text-xs font-mono text-sky-400/70 tracking-widest uppercase">{title}</span>
        <div className="w-1.5 h-1.5 rounded-full bg-sky-400 animate-pulse" />
      </div>
      {children}
    </div>
  );
}

export default function DashboardPage() {
  const [selected, setSelected] = useState(satellites[4]);

  return (
    <main className="relative min-h-screen w-full bg-[#020617] overflow-x-hidden text-white">
      <div className="absolute inset-0 z-0 pointer-events-none"><StarsCanvas /></div>
      <Navbar />

      <div className="relative z-10 pt-32 pb-24 px-6 max-w-7xl mx-auto">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }} className="mb-10">
          <p className="text-xs tracking-[0.4em] text-sky-400/70 uppercase mb-3">OrbitGuard Control Suite</p>
          <h1 className="font-black text-4xl sm:text-5xl tracking-tight">Mission Dashboard</h1>
          <p className="text-white/40 text-sm mt-2">Live orbital data · Updated 6s ago</p>
        </motion.div>

        {/* Top stat tiles */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          {[{ label:"Tracked Objects", val:"50,247", delta:"+12 today", color:"#38BDF8" },{ label:"Active Satellites", val:"12,381", delta:"+3 today", color:"#60A5FA" },{ label:"High-Risk Events", val:"7", delta:"↑2 from yesterday", color:"#f59e0b" },{ label:"Critical Alerts", val:"1", delta:"Immediate action", color:"#ef4444" }].map((s,i) => (
            <motion.div key={s.label} initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }} transition={{ delay:0.1*i+0.2 }} data-testid={`stat-${s.label.toLowerCase().replace(/\s/g,"-")}`}
              className="rounded-2xl p-5" style={{ background:"rgba(255,255,255,0.025)", border:"1px solid rgba(255,255,255,0.07)" }}>
              <p className="text-white/40 text-xs tracking-widest uppercase mb-2">{s.label}</p>
              <p className="font-black text-3xl font-mono mb-1" style={{ color:s.color }}>{s.val}</p>
              <p className="text-white/30 text-xs">{s.delta}</p>
            </motion.div>
          ))}
        </div>

        {/* Main grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 mb-5">
          {/* Satellite table */}
          <motion.div initial={{ opacity:0, x:-30 }} animate={{ opacity:1, x:0 }} transition={{ delay:0.4, duration:0.8 }} className="lg:col-span-2">
            <Widget title="Satellite Status Table">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-white/30 text-xs border-b border-white/5">
                    {["Object ID","Operator","Orbit","Status","Risk Score"].map(h=><th key={h} className="text-left pb-3 font-mono tracking-wider">{h}</th>)}
                  </tr>
                </thead>
                <tbody>
                  {satellites.map((sat, i) => {
                    const statusColor = sat.status==="Critical"?"#ef4444":sat.status==="Alert"?"#f59e0b":sat.status==="Monitor"?"#60A5FA":"#22c55e";
                    return (
                      <tr key={sat.id} onClick={()=>setSelected(sat)} className={`border-b border-white/5 cursor-pointer transition-colors ${selected.id===sat.id?"bg-sky-400/5":""} hover:bg-white/5`} data-testid={`row-satellite-${i+1}`}>
                        <td className="py-3 font-mono text-sky-300 text-xs">{sat.id}</td>
                        <td className="py-3 text-white/70">{sat.operator}</td>
                        <td className="py-3 text-white/40 text-xs">{sat.orbit}</td>
                        <td className="py-3"><span className="text-xs px-2 py-0.5 rounded-full" style={{ background:`${statusColor}20`, color:statusColor, border:`1px solid ${statusColor}40` }}>{sat.status}</span></td>
                        <td className="py-3 w-28"><RiskBar val={sat.risk} /></td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </Widget>
          </motion.div>

          {/* Risk detail */}
          <motion.div initial={{ opacity:0, x:30 }} animate={{ opacity:1, x:0 }} transition={{ delay:0.5, duration:0.8 }}>
            <Widget title="Risk Intelligence" className="h-full">
              <div className="flex flex-col gap-4">
                <div className="text-center py-4">
                  <p className="text-xs text-white/30 font-mono mb-2">{selected.id}</p>
                  <div className="relative inline-flex items-center justify-center w-28 h-28">
                    <svg className="absolute" width="112" height="112" viewBox="0 0 112 112">
                      <circle cx="56" cy="56" r="48" fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="8" />
                      <motion.circle key={selected.risk} cx="56" cy="56" r="48" fill="none"
                        stroke={selected.risk>75?"#ef4444":selected.risk>40?"#f59e0b":"#22c55e"}
                        strokeWidth="8" strokeLinecap="round"
                        strokeDasharray={`${(selected.risk/100)*301.6} 301.6`}
                        strokeDashoffset="75.4"
                        initial={{ strokeDasharray:"0 301.6" }}
                        animate={{ strokeDasharray:`${(selected.risk/100)*301.6} 301.6` }}
                        transition={{ duration:1, ease:"easeOut" }}
                        style={{ filter:`drop-shadow(0 0 6px ${selected.risk>75?"#ef4444":selected.risk>40?"#f59e0b":"#22c55e"})` }}
                      />
                    </svg>
                    <div className="text-center">
                      <div className="font-black text-3xl font-mono" style={{ color:selected.risk>75?"#ef4444":selected.risk>40?"#f59e0b":"#22c55e" }}>{selected.risk}</div>
                      <div className="text-white/30 text-xs">/ 100</div>
                    </div>
                  </div>
                  <p className="text-white/60 text-sm font-semibold mt-2">Risk Score</p>
                </div>
                {[{ f:"Relative Velocity", v:"14.2 km/s" },{ f:"Miss Distance", v:"182m" },{ f:"Orbital Congestion", v:"High" },{ f:"Historical Risk", v:"Elevated" }].map(item=>(
                  <div key={item.f} className="flex justify-between items-center py-2 border-b border-white/5">
                    <span className="text-white/40 text-xs">{item.f}</span>
                    <span className="text-white text-xs font-mono">{item.v}</span>
                  </div>
                ))}
              </div>
            </Widget>
          </motion.div>
        </div>

        {/* Bottom widgets */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
          <Widget title="Conjunction Forecast">
            <div className="flex flex-col gap-3">
              {[{ time:"T+02:14", risk:"Critical", color:"#ef4444" },{ time:"T+06:51", risk:"High", color:"#f59e0b" },{ time:"T+18:33", risk:"Moderate", color:"#60A5FA" },{ time:"T+24:00", risk:"Low", color:"#22c55e" }].map(e=>(
                <div key={e.time} className="flex justify-between items-center py-2 border-b border-white/5">
                  <span className="font-mono text-xs text-white/50">{e.time}</span>
                  <span className="text-xs px-2 py-0.5 rounded-full" style={{ background:`${e.color}20`, color:e.color }}>{e.risk}</span>
                </div>
              ))}
            </div>
          </Widget>

          <Widget title="Orbital Density Heatmap">
            <div className="grid grid-cols-8 gap-1">
              {Array.from({length:64},(_,i)=>{
                const intensity = Math.random();
                const alpha = 0.15 + intensity * 0.6;
                const bg = intensity>0.8 ? `rgba(239,68,68,${alpha})` : intensity>0.6 ? `rgba(245,158,11,${alpha})` : `rgba(56,189,248,${alpha})`;
                return <div key={i} className="aspect-square rounded-sm" style={{ background: bg }} />;
              })}
            </div>
            <div className="flex justify-between mt-3 text-xs text-white/30">
              <span>Low</span><span>High density</span>
            </div>
          </Widget>

          <Widget title="Threat Radar">
            <div className="relative flex items-center justify-center h-36">
              <div className="relative w-32 h-32">
                {[32,24,16,8].map((r,i)=>(
                  <div key={i} className="absolute rounded-full border border-sky-400/15" style={{ inset:`${i*8}px` }} />
                ))}
                <div className="absolute inset-0 rounded-full overflow-hidden">
                  <motion.div className="absolute inset-0 rounded-full" style={{ background:"conic-gradient(from 0deg, rgba(56,189,248,0.3), transparent 120deg, transparent 360deg)", transformOrigin:"center" }} animate={{ rotate:360 }} transition={{ duration:3, repeat:Infinity, ease:"linear" }} />
                </div>
                {[{top:"20%",left:"65%"},{top:"60%",left:"30%"},{top:"40%",left:"50%"}].map((pos,i)=>(
                  <div key={i} className="absolute w-1.5 h-1.5 rounded-full bg-sky-400" style={{ ...pos, boxShadow:"0 0 6px rgba(56,189,248,0.9)" }} />
                ))}
                <div className="absolute w-2 h-2 rounded-full bg-red-400 top-[55%] left-[55%]" style={{ boxShadow:"0 0 8px rgba(239,68,68,0.9)" }} />
              </div>
              <div className="absolute bottom-0 right-0 text-xs text-white/30 font-mono">1 threat</div>
            </div>
          </Widget>
        </div>
      </div>
    </main>
  );
}
