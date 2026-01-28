import React, { useState, useMemo, useEffect, useCallback } from 'react';
import { 
  LayoutDashboard, ShieldAlert, TrendingDown, Zap, CheckSquare, FileText, ChevronRight, 
  AlertTriangle, ArrowUpRight, ArrowDownRight, BarChart3, Globe, Settings, Bell, Search, 
  Plus, Filter, Download, Share2, Clock, Target, Maximize2, Activity, X, Wifi, Cpu, Database
} from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

// CHANGED: Using the proxy path instead of hardcoded localhost
const API_BASE = '/api';

/**
 * SHARED UI COMPONENTS (GlassCard, SectionHeader) - Kept same for cinematic look
 */
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

// --- UPDATED VIEW COMPONENTS ---

const DashboardView = ({ risks, liveSignals }) => {
  const criticalCount = risks.filter(r => r.status === 'CRITICAL').length;
  
  // Calculate total revenue loss from backend financial engine
  const totalRevenueAtRisk = risks.reduce((acc, r) => acc + (r.financialImpact?.revenueLoss || 0), 0);

  return (
    <div className="space-y-6 animate-in">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <GlassCard className="flex flex-col justify-between min-h-[160px]">
          <div>
            <p className="text-[10px] font-black uppercase tracking-widest text-zinc-500 mb-2">Revenue at Risk</p>
            <h3 className="text-5xl font-extralight tracking-tighter text-white">
              ₹{(totalRevenueAtRisk / 100000).toFixed(1)}L
            </h3>
          </div>
          <div className="flex justify-between items-end mt-4">
            <p className="text-[10px] text-zinc-600 font-mono">Monthly Exposure</p>
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
          <p className="text-[10px] text-zinc-600 font-mono uppercase">
            {criticalCount > 0 ? 'Threat Imminent' : 'Nominal'}
          </p>
        </GlassCard>

        <GlassCard className="flex flex-col justify-between min-h-[160px]">
           <div>
            <p className="text-[10px] font-black uppercase tracking-widest text-zinc-500 mb-2">Active Signals</p>
            <h3 className="text-5xl font-extralight tracking-tighter text-white">{risks.length}</h3>
          </div>
          <p className="text-[10px] text-zinc-600 font-mono uppercase">Registry Core</p>
        </GlassCard>

        <GlassCard className="flex flex-col justify-between min-h-[160px] bg-blue-500/5">
           <div>
            <p className="text-[10px] font-black uppercase tracking-widest text-blue-500 mb-2">Health ETA</p>
            <h3 className="text-5xl font-extralight tracking-tighter text-white">14d</h3>
          </div>
          <p className="text-[10px] text-blue-300 font-mono uppercase">Recovery Base</p>
        </GlassCard>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <GlassCard className="lg:col-span-2">
           <div className="flex justify-between items-center mb-8">
             <h4 className="text-white font-medium tracking-tight">Signal Velocity</h4>
             <Activity size={18} className="text-blue-500" />
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
             <Database size={16} className="mr-2 text-zinc-500" /> Intelligence Feed
           </h4>
           <div className="space-y-6 flex-1 overflow-y-auto pr-2 custom-scrollbar">
              {liveSignals.map(s => (
                <div key={s.id} className="relative pl-6 border-l border-white/5 py-1 group">
                   <div className={`absolute -left-1 top-2 w-2 h-2 rounded-full shadow-lg ${s.urgency === 'High' ? 'bg-rose-500' : 'bg-blue-500'}`} />
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

const ActionCenterView = ({ actions }) => (
  <div className="space-y-8 animate-in">
    <SectionHeader title="Action Registry" subtitle="Automated Mitigation Steps" count={actions.length} />
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {actions.map((action, idx) => (
        <GlassCard key={idx} className="hover:-translate-y-1 transition-transform">
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
    </div>
  </div>
);

// --- MAIN APPLICATION ---

export default function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [risks, setRisks] = useState([]);
  const [actions, setActions] = useState([]);
  const [liveSignals, setLiveSignals] = useState([]);
  const [isConnected, setIsConnected] = useState(false);

  // UPDATED: Mapping the backend data to fit the UI state
  const syncIntelligence = useCallback(async () => {
    try {
      const risksRes = await fetch(`${API_BASE}/risks`);
      if (risksRes.ok) {
        const data = await risksRes.json();
        setRisks(data);
        
        // Populate sidebar from processed risks
        setLiveSignals(data.map(r => ({
          id: r.id,
          text: r.description,
          urgency: r.status === 'CRITICAL' ? 'High' : 'Med',
          type: r.type
        })));

        // Populate actions from recommendations engine
        setActions(data.flatMap(r => 
          r.recommendations.map((rec, i) => ({
            id: `${r.id}-${i}`,
            task: rec,
            status: 'STANDBY',
            owner: 'System-Alpha',
            priority: r.status === 'CRITICAL' ? 'Critical' : 'Low'
          }))
        ));

        setIsConnected(true);
      }
    } catch (e) { 
      setIsConnected(false); 
      console.warn("Intelligence server offline. Operating in Standalone Mode.");
    }
  }, []);

  useEffect(() => {
    syncIntelligence();
    const interval = setInterval(syncIntelligence, 10000);
    return () => clearInterval(interval);
  }, [syncIntelligence]);

  return (
    <div className="bg-[#000000] min-h-screen text-zinc-100 pb-32">
      {/* Styles & HUD Nav remain same */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@100;300;400;700;900&display=swap');
        body { font-family: 'Inter', sans-serif; background: #000; margin: 0; }
        .animate-in { animation: fadeIn 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(15px); } to { opacity: 1; transform: translateY(0); } }
      `}</style>

      <nav className="fixed top-8 left-1/2 -translate-x-1/2 z-[100] w-fit">
        <div className="bg-black/90 backdrop-blur-3xl border border-white/[0.08] rounded-full px-8 py-3 flex items-center space-x-12 shadow-2xl">
          <div className="flex items-center space-x-3 mr-6 pr-8 border-r border-white/10">
            <ShieldAlert size={16} className="text-blue-500" />
            <span className="text-sm font-black tracking-tighter uppercase italic">CB</span>
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
              <tab.icon size={18} />
              {activeTab === tab.id && <div className="absolute -bottom-3 w-1.5 h-1.5 bg-blue-500 rounded-full" />}
            </button>
          ))}
          
          <div className="pl-8 border-l border-white/10">
            <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-emerald-500' : 'bg-rose-500'} animate-pulse`} />
          </div>
        </div>
      </nav>

      <main className="max-w-[1400px] mx-auto pt-40 px-12">
        <div className="mb-24">
          <h1 className="text-[140px] font-thin tracking-tighter leading-[0.7] text-white select-none">
            Crisis<span className="text-zinc-400/40">Board</span>
          </h1>
          <div className="mt-10 flex items-center space-x-8">
            <p className="text-zinc-500 font-mono text-[10px] uppercase tracking-[0.5em]">
              Node: Intelligence-Core-4
            </p>
            <p className="text-zinc-700 font-mono text-[10px] uppercase tracking-[0.5em]">
              STATUS: {isConnected ? 'SYNC_ACTIVE' : 'OFFLINE_MODE'}
            </p>
          </div>
        </div>

        {activeTab === 'dashboard' && <DashboardView risks={risks} liveSignals={liveSignals} />}
        {activeTab === 'explorer' && (
          <div className="animate-in grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {risks.map(r => (
              <GlassCard key={r.id}>
                <span className={`px-2 py-0.5 rounded text-[9px] font-black border ${r.status === 'CRITICAL' ? 'text-rose-500 border-rose-500/20' : 'text-blue-500 border-blue-500/20'}`}>
                  {r.status}
                </span>
                <h3 className="text-2xl text-white font-extralight mt-4 mb-2">{r.title}</h3>
                <p className="text-xs text-zinc-500 mb-6">{r.description}</p>
                <div className="border-t border-white/5 pt-4 flex justify-between">
                  <span className="text-[10px] text-zinc-500">SCORE: {r.score}</span>
                  <span className="text-[10px] text-zinc-500">{r.location}</span>
                </div>
              </GlassCard>
            ))}
          </div>
        )}
        {activeTab === 'actions' && <ActionCenterView actions={actions} />}
        {activeTab === 'brief' && (
          <div className="flex justify-center animate-in">
             <div className="w-full max-w-[800px] bg-white text-black p-20 shadow-2xl">
                <h2 className="text-6xl font-black italic border-b-8 border-black pb-8 mb-8 uppercase">Intelligence Brief</h2>
                <p className="text-3xl font-light leading-tight">
                  High-velocity risk detected in <span className="font-bold underline">Tech Sector</span>. 
                  Financial exposure calculated at <span className="font-bold">₹{(risks.reduce((acc, r) => acc + (r.financialImpact?.revenueLoss || 0), 0) / 100000).toFixed(1)}L</span>.
                </p>
             </div>
          </div>
        )}
      </main>

      {/* Cinematic Grain */}
      <div className="fixed inset-0 pointer-events-none opacity-[0.04] z-[200]" 
           style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.7' numOctaves='3'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` }}>
      </div>
    </div>
  );
}
