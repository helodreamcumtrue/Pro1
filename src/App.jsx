import React, { useState, useMemo, useEffect, useCallback } from 'react';
import { 
  LayoutDashboard, ShieldAlert, TrendingDown, Zap, CheckSquare, FileText, ChevronRight, 
  AlertTriangle, ArrowUpRight, ArrowDownRight, BarChart3, Globe, Settings, Bell, Search, 
  Plus, Filter, Download, Share2, Clock, Target, Maximize2, Activity, X, Wifi, Cpu, Database
} from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const API_BASE = 'http://localhost:4000/api';

/**
 * CRISISBOARD: INDUSTRY-LEVEL INTELLIGENCE
 * Consolidated Single-File Architecture
 */

// --- Shared UI Components ---

const GlassCard = ({ children, className = "", highlight = false }) => (
  <div className={`relative overflow-hidden rounded-[24px] p-6 transition-all duration-500 border ${
    highlight ? 'bg-rose-500/5 border-rose-500/20' : 'bg-zinc-900/40 border-white/[0.08] hover:border-white/10'
  } ${className}`}>
    <div className="absolute inset-0 bg-gradient-to-br from-white/[0.02] via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
    {children}
  </div>
);

const SectionHeader = ({ title, subtitle, count }) => (
  <div className="mb-10 animate-in">
    <div className="flex items-center space-x-4 mb-2">
      <h2 className="text-4xl font-extralight tracking-tighter text-white">{title}</h2>
      {count !== undefined && (
        <span className="px-3 py-1 bg-white/5 border border-white/10 rounded-full text-[10px] font-black text-zinc-500 uppercase tracking-widest">
          {count} Active
        </span>
      )}
    </div>
    <p className="text-zinc-500 text-xs font-mono uppercase tracking-[0.3em]">{subtitle}</p>
  </div>
);

// --- Sub-Views ---

const DashboardView = ({ risks, liveSignals }) => {
  const criticalCount = risks.filter(r => r.status === 'CRITICAL').length;
  
  return (
    <div className="space-y-6 animate-in">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <GlassCard className="flex flex-col justify-between min-h-[160px]">
          <div>
            <p className="text-[10px] font-black uppercase tracking-widest text-zinc-500 mb-2">Revenue at Risk</p>
            <h3 className="text-5xl font-extralight tracking-tighter text-white">
              ₹{(risks.reduce((acc, r) => acc + (r.financialImpact?.revenueLoss || 0), 0) / 100000).toFixed(1)}L
            </h3>
          </div>
          <div className="flex justify-between items-end mt-4">
            <p className="text-[10px] text-zinc-600 font-mono">Total Monthly Exposure</p>
            <div className="flex items-center text-[10px] font-bold text-rose-500 bg-rose-500/10 px-2 py-0.5 rounded-full">
              <ArrowUpRight size={12} className="mr-1" /> +14.2%
            </div>
          </div>
        </GlassCard>

        <GlassCard className="flex flex-col justify-between min-h-[160px]" highlight={criticalCount > 0}>
          <div>
            <p className="text-[10px] font-black uppercase tracking-widest text-zinc-500 mb-2">Global Index</p>
            <h3 className="text-5xl font-extralight tracking-tighter text-white">74</h3>
          </div>
          <p className="text-[10px] text-zinc-600 font-mono uppercase">Status: {criticalCount > 0 ? 'Threat Imminent' : 'Baseline Nominal'}</p>
        </GlassCard>

        <GlassCard className="flex flex-col justify-between min-h-[160px]">
           <div>
            <p className="text-[10px] font-black uppercase tracking-widest text-zinc-500 mb-2">Active Signals</p>
            <h3 className="text-5xl font-extralight tracking-tighter text-white">{risks.length}</h3>
          </div>
          <p className="text-[10px] text-zinc-600 font-mono uppercase">Standardized Registry</p>
        </GlassCard>

        <GlassCard className="flex flex-col justify-between min-h-[160px] bg-blue-500/5">
           <div>
            <p className="text-[10px] font-black uppercase tracking-widest text-blue-500 mb-2">Health ETA</p>
            <h3 className="text-5xl font-extralight tracking-tighter text-white">14d</h3>
          </div>
          <p className="text-[10px] text-blue-300 font-mono uppercase">Recovery Baseline</p>
        </GlassCard>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <GlassCard className="lg:col-span-2">
           <div className="flex justify-between items-center mb-8">
             <h4 className="text-white font-medium tracking-tight">Signal Velocity Graph</h4>
             <Activity size={18} className="text-blue-500" />
           </div>
           <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={risks.length > 0 ? risks[0].trend.map((v, i) => ({ n: i, v })) : []}>
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
             <Database size={16} className="mr-2 text-zinc-500" /> Live Feed
           </h4>
           <div className="space-y-6 flex-1 overflow-y-auto pr-2 custom-scrollbar">
              {liveSignals.map(s => (
                <div key={s.id} className="relative pl-6 border-l border-white/5 py-1 group">
                   <div className="absolute -left-1 top-2 w-2 h-2 rounded-full bg-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.6)] group-hover:scale-125 transition-transform" />
                   <p className="text-xs text-zinc-400 font-medium leading-relaxed">{s.text}</p>
                   <p className="text-[9px] font-black text-zinc-600 uppercase mt-2 tracking-widest">{s.urgency} • {s.type}</p>
                </div>
              ))}
           </div>
        </GlassCard>
      </div>
    </div>
  );
};

const ActionCenterView = ({ actions, onAddAction }) => {
  return (
    <div className="space-y-8 animate-in">
      <SectionHeader title="Action Registry" subtitle="Mitigation lifecycle management" count={actions.length} />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {actions.map(action => (
          <GlassCard key={action.id} className="hover:-translate-y-1 transition-transform">
             <div className="flex justify-between items-start mb-6">
               <span className="px-2 py-0.5 bg-blue-500/10 text-blue-500 text-[9px] font-black rounded border border-blue-500/20 uppercase tracking-widest">
                 {action.status}
               </span>
               <Target size={14} className="text-zinc-700" />
             </div>
             <h3 className="text-xl text-white font-light mb-2">{action.task}</h3>
             <div className="mt-8 pt-6 border-t border-white/5 flex justify-between items-center">
                <div className="flex flex-col">
                   <span className="text-[9px] text-zinc-600 font-black uppercase mb-1">Owner</span>
                   <span className="text-xs text-white">{action.owner}</span>
                </div>
                <div className="text-right flex flex-col">
                   <span className="text-[9px] text-zinc-600 font-black uppercase mb-1">Priority</span>
                   <span className={`text-xs ${action.priority === 'Critical' ? 'text-rose-500 font-bold' : 'text-zinc-400'}`}>{action.priority}</span>
                </div>
             </div>
          </GlassCard>
        ))}
        <div 
          onClick={onAddAction}
          className="border border-dashed border-white/10 rounded-[24px] flex flex-col items-center justify-center p-10 group cursor-pointer hover:border-white/30 transition-all min-h-[200px]"
        >
          <Plus size={24} className="text-zinc-600 group-hover:text-white mb-3" />
          <p className="text-[10px] font-black text-zinc-600 uppercase tracking-widest group-hover:text-zinc-400">Deploy Mitigation Task</p>
        </div>
      </div>
    </div>
  );
};

// --- Main Application ---

export default function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [risks, setRisks] = useState([]);
  const [actions, setActions] = useState([]);
  const [liveSignals, setLiveSignals] = useState([]);
  const [isConnected, setIsConnected] = useState(false);
  const [isRiskPanelOpen, setIsRiskPanelOpen] = useState(false);

  const syncIntelligence = useCallback(async () => {
    try {
      const [risksRes, signalsRes, actionsRes] = await Promise.all([
        fetch(`${API_BASE}/risks`),
        fetch(`${API_BASE}/signals/live`),
        fetch(`${API_BASE}/actions`)
      ]);
      if (risksRes.ok) setRisks(await risksRes.json());
      if (signalsRes.ok) setLiveSignals(await signalsRes.json());
      if (actionsRes.ok) setActions(await actionsRes.json());
      setIsConnected(true);
    } catch (e) { 
      setIsConnected(false); 
      // Fallback logic for demo purposes if backend isn't live
      setRisks([
        { id: 1, title: 'Compliance Gap', type: 'REGULATORY', status: 'CRITICAL', impact: 80, score: 75, trend: [20, 40, 60, 80], description: 'Audit required immediately.' },
        { id: 2, title: 'FX Volatility', type: 'FISCAL', status: 'WARNING', impact: 40, score: 45, trend: [10, 20, 35, 40], description: 'INR/USD corridor flux.' }
      ]);
      setLiveSignals([
        { id: 1, text: "Market flux detected in APAC region", urgency: "Med", type: "MKT" }
      ]);
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
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@100;300;400;700;900&display=swap');
        body { font-family: 'Inter', sans-serif; background: #000; margin: 0; }
        ::-webkit-scrollbar { width: 3px; }
        ::-webkit-scrollbar-thumb { background: #222; border-radius: 10px; }
        .animate-in { animation: fadeIn 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(15px); } to { opacity: 1; transform: translateY(0); } }
        .custom-scrollbar::-webkit-scrollbar { width: 2px; }
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
            { id: 'actions', icon: CheckSquare, label: 'Action' },
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
            <h1 className="text-[140px] font-thin tracking-tighter leading-[0.7] text-white select-none">
              Crisis<span className="text-zinc-400/40">Board</span>
            </h1>
            <div className="mt-10 flex items-center space-x-8">
              <p className="text-zinc-500 font-mono text-[10px] uppercase tracking-[0.5em] flex items-center">
                <span className="w-1.5 h-1.5 rounded-full bg-blue-500 mr-3 animate-pulse"></span>
                Node: Alpha-7
              </p>
              <p className="text-zinc-700 font-mono text-[10px] uppercase tracking-[0.5em]">
                Status: {isConnected ? 'Synchronized' : 'Standalone Mode'}
              </p>
            </div>
          </div>
        </div>

        {activeTab === 'dashboard' && <DashboardView risks={risks} liveSignals={liveSignals} />}
        {activeTab === 'explorer' && (
          <div className="animate-in">
             <SectionHeader title="Threat Explorer" subtitle="Intelligence Sector Registry" count={risks.length} />
             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
               {risks.map(r => (
                 <GlassCard key={r.id}>
                    <div className="flex justify-between items-start mb-8">
                       <span className={`px-2 py-0.5 rounded text-[9px] font-black border ${r.status === 'CRITICAL' ? 'bg-rose-500/10 text-rose-500 border-rose-500/20' : 'bg-blue-500/10 text-blue-500 border-blue-500/20'}`}>
                         {r.status}
                       </span>
                       <Maximize2 size={14} className="text-zinc-700" />
                    </div>
                    <h3 className="text-2xl text-white font-extralight tracking-tight mb-3">{r.title}</h3>
                    <p className="text-xs text-zinc-500 line-clamp-2 leading-relaxed mb-8">{r.description}</p>
                    <div className="grid grid-cols-2 gap-4 border-t border-white/5 pt-6 mt-auto">
                       <div className="flex flex-col">
                         <span className="text-[9px] text-zinc-600 font-black uppercase mb-1">Impact</span>
                         <span className="text-xs text-white uppercase">{r.impact}%</span>
                       </div>
                       <div className="flex flex-col text-right">
                         <span className="text-[9px] text-zinc-600 font-black uppercase mb-1">Score</span>
                         <span className="text-xs text-white">{r.score}</span>
                       </div>
                    </div>
                 </GlassCard>
               ))}
               <div className="border border-dashed border-white/10 rounded-[24px] flex flex-col items-center justify-center p-12 group cursor-pointer hover:border-blue-500/30 transition-all">
                  <Plus size={24} className="text-zinc-700 group-hover:text-white mb-3" />
                  <p className="text-[10px] font-black text-zinc-600 uppercase tracking-widest">Register Signal</p>
               </div>
             </div>
          </div>
        )}
        {activeTab === 'actions' && <ActionCenterView actions={actions} onAddAction={() => {}} />}
        {activeTab === 'brief' && (
          <div className="flex flex-col items-center animate-in">
             <div className="w-full max-w-[850px] bg-white text-black p-16 md:p-24 shadow-2xl relative">
                <div className="flex justify-between items-start border-b-[6px] border-black pb-12 mb-12">
                   <h1 className="text-7xl font-black tracking-tighter italic leading-[0.8] uppercase">CRISIS<br/>BOARD</h1>
                   <div className="text-right">
                      <p className="font-bold text-[10px] tracking-[0.4em] uppercase text-zinc-400 mb-2">Alpha-9 Intel Protocol</p>
                      <button className="flex items-center space-x-2 border-2 border-black px-4 py-2 text-[10px] font-black uppercase tracking-widest hover:bg-black hover:text-white transition-all">
                        <Download size={14} /> <span>PDF EXPORT</span>
                      </button>
                   </div>
                </div>
                <p className="text-4xl font-extralight tracking-tighter leading-tight mb-16">
                  Structural risk detected in <span className="font-bold underline">Market corridors</span>. Exposure identified at <span className="font-bold underline">₹{(risks.reduce((acc, r) => acc + (r.financialImpact?.revenueLoss || 0), 0) / 100000).toFixed(1)}L</span>.
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
