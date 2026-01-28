import React, { useState, useMemo, useEffect, useCallback } from 'react';
import { 
  LayoutDashboard, ShieldAlert, TrendingDown, Zap, CheckSquare, FileText, ChevronRight, 
  AlertTriangle, ArrowUpRight, ArrowDownRight, BarChart3, Globe, Settings, Bell, Search, 
  Plus, Filter, Download, Share2, Clock, Target, Maximize2, Activity, X, Wifi, Cpu, Database
} from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const API_BASE = 'http://localhost:4000/api';

/**
 * CRISISBOARD: EXECUTIVE RISK COMMAND CENTER
 * Integrated Frontend Architecture (Single-File)
 */

// --- Resilience Logic: Mock Data Fallback ---
const INITIAL_MOCK_RISKS = [
  { 
    id: 'mock-1', 
    type: 'REGULATORY', 
    title: 'AI Act Compliance Delta', 
    industry: 'Tech', 
    location: 'EU', 
    impact: 9, 
    score: 88, 
    status: 'CRITICAL', 
    description: 'Infrastructure audit required for compliance.', 
    trend: [40, 50, 65, 88],
    financialImpact: { revenueLoss: 240000, marginErosion: 2.1 }
  },
  { 
    id: 'mock-2', 
    type: 'LOGISTICS', 
    title: 'Global Freight Volatility', 
    industry: 'Retail', 
    location: 'Global', 
    impact: 7, 
    score: 62, 
    status: 'WARNING', 
    description: 'Rerouting adding 14 days to lead times.', 
    trend: [30, 45, 42, 62],
    financialImpact: { revenueLoss: 120000, marginErosion: 1.4 }
  }
];

// --- Shared UI Components ---

const GlassCard = ({ children, className = "", highlight = false }) => (
  <div className={`relative overflow-hidden rounded-[24px] p-6 transition-all duration-500 border ${
    highlight ? 'bg-rose-500/5 border-rose-500/20' : 'bg-zinc-900/40 border-white/[0.08] hover:border-white/10'
  } ${className}`}>
    <div className="absolute inset-0 bg-gradient-to-br from-white/[0.02] via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
    {children}
  </div>
);

const BentoStat = ({ label, value, trend, subtext }) => (
  <GlassCard className="flex flex-col justify-between min-h-[160px]">
    <div>
      <p className="text-[10px] font-black uppercase tracking-widest text-zinc-500 mb-2">{label}</p>
      <h3 className="text-5xl font-extralight tracking-tighter text-white">{value}</h3>
    </div>
    <div className="flex items-end justify-between mt-4">
      <p className="text-[10px] text-zinc-600 font-mono uppercase tracking-tighter">{subtext}</p>
      <div className={`flex items-center text-[11px] font-bold ${trend >= 0 ? 'text-rose-500' : 'text-emerald-500'}`}>
        {trend >= 0 ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
        {Math.abs(trend)}%
      </div>
    </div>
  </GlassCard>
);

// --- Sub-Views ---

const DashboardView = ({ risks, liveSignals }) => (
  <div className="space-y-6 animate-in fade-in slide-in-from-bottom-8 duration-1000">
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <BentoStat 
        label="Revenue Exposure" 
        value={`₹${(risks.reduce((acc, r) => acc + (r.financialImpact?.revenueLoss || 0), 0) / 100000).toFixed(1)}L`} 
        trend={14.2} 
        subtext="Projected monthly hit" 
      />
      <BentoStat 
        label="Risk Index" 
        value={risks.length > 0 ? Math.round(risks.reduce((acc, r) => acc + (r.score || 0), 0) / risks.length) : 0} 
        trend={2.1} 
        subtext="Global aggregate score" 
      />
      <BentoStat label="Active Signals" value={risks.length} trend={-4} subtext="Aggregated feeds" />
      <BentoStat label="Recovery ETA" value="14d" trend={0} subtext="Mitigation window" />
    </div>

    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <GlassCard className="lg:col-span-2">
         <div className="flex justify-between items-center mb-8">
           <h4 className="text-white font-medium tracking-tight">Signal Velocity Graph</h4>
           <Activity size={18} className="text-blue-400" />
         </div>
         <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={risks.length > 0 && risks[0].trend ? risks[0].trend.map((v, i) => ({ n: i, v })) : []}>
              <defs>
                <linearGradient id="grad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.2}/>
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#ffffff05" vertical={false} />
              <Tooltip contentStyle={{ background: '#000', border: '1px solid #ffffff10', borderRadius: '12px' }} />
              <Area type="monotone" dataKey="v" stroke="#3b82f6" strokeWidth={2} fill="url(#grad)" />
            </AreaChart>
          </ResponsiveContainer>
         </div>
      </GlassCard>

      <GlassCard className="flex flex-col h-full">
         <h4 className="text-white font-medium mb-6 flex items-center">
           <Database size={16} className="mr-2 text-zinc-500" /> Live Signal Feed
         </h4>
         <div className="space-y-6 flex-1 overflow-y-auto pr-2 custom-scrollbar">
            {liveSignals.length > 0 ? liveSignals.map(s => (
              <div key={s.id} className="relative pl-6 border-l border-white/5 py-1 group">
                 <div className="absolute -left-1 top-2 w-2 h-2 rounded-full bg-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.6)]" />
                 <p className="text-xs text-zinc-400 font-medium leading-relaxed">{s.text}</p>
                 <p className="text-[9px] font-black text-zinc-600 uppercase mt-2 tracking-widest">{s.urgency} • {s.type}</p>
              </div>
            )) : (
              <p className="text-xs text-zinc-600 italic">Syncing external intelligence...</p>
            )}
         </div>
      </GlassCard>
    </div>
  </div>
);

const RiskExplorerView = ({ risks, onAddClick }) => (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-in">
    {risks.map((risk) => (
      <GlassCard key={risk.id} className="hover:-translate-y-1">
        <div className="flex justify-between items-start mb-8">
          <span className={`px-2 py-0.5 rounded text-[9px] font-black border ${risk.status === 'CRITICAL' ? 'bg-rose-500/10 text-rose-500 border-rose-500/20' : 'bg-blue-500/10 text-blue-500 border-blue-500/20'}`}>
            {risk.status}
          </span>
          <Maximize2 size={14} className="text-zinc-700" />
        </div>
        <h3 className="text-2xl text-white font-extralight tracking-tight mb-3">{risk.title}</h3>
        <p className="text-xs text-zinc-500 line-clamp-2 leading-relaxed mb-8">{risk.description}</p>
        <div className="grid grid-cols-2 gap-4 border-t border-white/5 pt-6 mt-auto">
          <div className="flex flex-col">
            <span className="text-[9px] text-zinc-600 font-black uppercase mb-1">Sector</span>
            <span className="text-xs text-white uppercase">{risk.industry}</span>
          </div>
          <div className="flex flex-col text-right">
            <span className="text-[9px] text-zinc-600 font-black uppercase mb-1">Exposure</span>
            <span className="text-xs text-white">₹{(risk.financialImpact?.revenueLoss / 1000).toFixed(0)}k</span>
          </div>
        </div>
      </GlassCard>
    ))}
    <div onClick={onAddClick} className="border border-dashed border-white/10 rounded-[24px] flex flex-col items-center justify-center p-12 group cursor-pointer hover:border-blue-500/30 transition-all min-h-[250px]">
      <Plus size={24} className="text-zinc-700 group-hover:text-white mb-3" />
      <p className="text-[10px] font-black text-zinc-600 uppercase tracking-widest">Register Signal</p>
    </div>
  </div>
);

// --- Main Application ---

export default function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [risks, setRisks] = useState([]);
  const [liveSignals, setLiveSignals] = useState([]);
  const [isConnected, setIsConnected] = useState(false);
  const [loading, setLoading] = useState(true);

  const syncIntelligence = useCallback(async () => {
    try {
      const controller = new AbortController();
      const id = setTimeout(() => controller.abort(), 2000);
      
      const [risksRes, signalsRes] = await Promise.all([
        fetch(`${API_BASE}/risks`, { signal: controller.signal }),
        fetch(`${API_BASE}/signals/live`, { signal: controller.signal })
      ]);
      clearTimeout(id);

      if (risksRes.ok) setRisks(await risksRes.json());
      if (signalsRes.ok) setLiveSignals(await signalsRes.json());
      setIsConnected(true);
    } catch (e) { 
      setIsConnected(false); 
      setRisks(INITIAL_MOCK_RISKS);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    syncIntelligence();
    const interval = setInterval(syncIntelligence, 10000);
    return () => clearInterval(interval);
  }, [syncIntelligence]);

  return (
    <div className="bg-[#000000] min-h-screen text-zinc-100 pb-32">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@100;200;300;400;700;900&display=swap');
        body { font-family: 'Inter', sans-serif; background: #000; margin: 0; }
        ::-webkit-scrollbar { width: 3px; }
        ::-webkit-scrollbar-thumb { background: #222; border-radius: 10px; }
        .animate-in { animation: fadeIn 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(15px); } to { opacity: 1; transform: translateY(0); } }
      `}</style>

      {/* Cinematic HUD Nav */}
      <nav className="fixed top-8 left-1/2 -translate-x-1/2 z-[100] w-fit">
        <div className="bg-black/90 backdrop-blur-3xl border border-white/[0.08] rounded-full px-8 py-3 flex items-center space-x-12 shadow-2xl shadow-black">
          <div className="flex items-center space-x-3 mr-6 pr-8 border-r border-white/10">
            <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-lg shadow-white/20">
              <ShieldAlert size={16} className="text-black" />
            </div>
            <span className="text-sm font-black tracking-tighter uppercase italic text-white">CB</span>
          </div>

          {[
            { id: 'dashboard', icon: LayoutDashboard, label: 'Vision' },
            { id: 'explorer', icon: Globe, label: 'Threats' },
            { id: 'sim', icon: TrendingDown, label: 'Warp' },
            { id: 'brief', icon: FileText, label: 'Brief' },
          ].map(tab => (
            <button 
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`relative flex flex-col items-center group transition-all ${activeTab === tab.id ? 'text-blue-500' : 'text-zinc-600 hover:text-zinc-300'}`}
            >
              <tab.icon size={18} className="transition-transform group-hover:-translate-y-1" />
              <span className="text-[7px] font-black uppercase mt-1.5 tracking-widest absolute top-8 opacity-0 group-hover:opacity-100 transition-opacity">
                {tab.label}
              </span>
              {activeTab === tab.id && <div className="absolute -bottom-3 w-1.5 h-1.5 bg-blue-500 rounded-full shadow-[0_0_10px_rgba(59,130,246,0.8)]" />}
            </button>
          ))}

          <div className="pl-8 border-l border-white/10 flex items-center space-x-6">
            <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]' : 'bg-rose-500 shadow-[0_0_10px_rgba(244,63,94,0.5)]'}`} />
            <div className="w-8 h-8 rounded-full bg-zinc-900 border border-white/5 flex items-center justify-center text-[10px] font-bold text-zinc-500">JD</div>
          </div>
        </div>
      </nav>

      <main className="max-w-[1400px] mx-auto pt-40 px-12">
        <div className="flex justify-between items-start mb-24">
          <div>
            <h1 className="text-[clamp(60px,10vw,140px)] font-thin tracking-tighter leading-[0.7] text-white select-none">
              Crisis<span className="text-zinc-400/40">Board</span>
            </h1>
            <div className="mt-10 flex items-center space-x-8">
              <p className="text-zinc-500 font-mono text-[10px] uppercase tracking-[0.5em] flex items-center">
                <span className="w-1.5 h-1.5 rounded-full bg-blue-500 mr-3 animate-pulse"></span>
                Strategic Node: Alpha-7
              </p>
              <p className="text-zinc-700 font-mono text-[10px] uppercase tracking-[0.5em]">
                Status: {isConnected ? 'Synchronized' : 'Offline Mode'}
              </p>
            </div>
          </div>
        </div>

        {activeTab === 'dashboard' && <DashboardView risks={risks} liveSignals={liveSignals} />}
        {activeTab === 'explorer' && <RiskExplorerView risks={risks} onAddClick={() => {}} />}
        {activeTab === 'sim' && <div className="animate-in flex flex-col items-center py-20 text-zinc-500 italic">Probability Warp Active — Syncing Baseline...</div>}
        {activeTab === 'brief' && (
          <div className="flex flex-col items-center animate-in">
             <div className="w-full max-w-[850px] bg-white text-black p-16 md:p-24 shadow-2xl relative">
                <div className="flex justify-between items-start border-b-[6px] border-black pb-12 mb-12">
                   <h1 className="text-7xl font-black tracking-tighter italic leading-[0.8] uppercase">CRISIS<br/>BOARD</h1>
                   <div className="text-right">
                      <p className="font-bold text-[10px] tracking-[0.4em] uppercase text-zinc-400 mb-2">Alpha-9 Protocol</p>
                      <button className="flex items-center space-x-2 border-2 border-black px-4 py-2 text-[10px] font-black uppercase tracking-widest hover:bg-black hover:text-white transition-all">
                        <Download size={14} /> <span>EXPORT</span>
                      </button>
                   </div>
                </div>
                <p className="text-4xl font-extralight tracking-tighter leading-tight mb-16">
                  Aggregate financial exposure identified at <span className="font-bold underline">₹{(risks.reduce((acc, r) => acc + (r.financialImpact?.revenueLoss || 0), 0) / 100000).toFixed(1)}L</span> across core sectors. 
                </p>
             </div>
          </div>
        )}
      </main>

      {/* Cinematic Grain Overlay */}
      <div className="fixed inset-0 pointer-events-none opacity-[0.04] contrast-150 grayscale mix-blend-overlay z-[200]" 
           style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.7' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` }}>
      </div>
    </div>
  );
}
