import React, { useState, useMemo, useEffect } from 'react';
import { 
  LayoutDashboard, 
  ShieldAlert, 
  TrendingDown, 
  Zap, 
  CheckSquare, 
  FileText, 
  ChevronRight, 
  AlertTriangle, 
  ArrowUpRight, 
  ArrowDownRight, 
  BarChart3, 
  Globe, 
  Settings,
  Bell,
  Search,
  Plus,
  Filter,
  Download,
  Share2,
  Clock,
  Target,
  Maximize2,
  MoreHorizontal,
  Activity,
  X,
  Wifi,
  WifiOff
} from 'lucide-react';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts';

const API_BASE = 'http://localhost:4000/api';

// --- Resilience Logic: Mock Data Fallback ---
const INITIAL_MOCK_RISKS = [
  { 
    id: 'mock-1', 
    type: 'REGULATORY', 
    title: 'AI Act Compliance Delta (Demo)', 
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
    title: 'Global Freight Volatility (Demo)', 
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

const GlassCard = ({ children, className = "" }) => (
  <div className={`bg-[#080808] border border-white/[0.08] hover:border-white/[0.15] transition-all duration-500 rounded-[20px] p-6 group relative overflow-hidden ${className}`}>
    <div className="absolute inset-0 bg-gradient-to-br from-white/[0.02] via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
    {children}
  </div>
);

const BentoStat = ({ label, value, trend, subtext }) => (
  <GlassCard className="flex flex-col justify-between min-h-[160px]">
    <div>
      <p className="text-[10px] font-black uppercase tracking-[0.25em] text-zinc-500 mb-2">{label}</p>
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

// --- Content Modules ---

const DashboardView = ({ risks }) => (
  <div className="space-y-4 animate-in fade-in slide-in-from-bottom-8 duration-1000">
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

    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
      <GlassCard className="lg:col-span-2">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h4 className="text-white font-medium tracking-tight">Risk Propagation Velocity</h4>
            <p className="text-[10px] text-zinc-500 mt-1 uppercase tracking-widest font-black">Time-series intelligence</p>
          </div>
          <Activity size={18} className="text-blue-400" />
        </div>
        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={risks.length > 0 && risks[0].trend ? risks[0].trend.map((val, i) => ({ name: `T-${i}`, value: val })) : []}>
              <defs>
                <linearGradient id="grad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#60a5fa" stopOpacity={0.2}/>
                  <stop offset="95%" stopColor="#60a5fa" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#ffffff05" vertical={false} />
              <XAxis dataKey="name" hide />
              <YAxis hide domain={[0, 100]} />
              <Tooltip 
                contentStyle={{ backgroundColor: '#000', border: '1px solid #ffffff10', borderRadius: '12px' }}
                itemStyle={{ color: '#fff', fontSize: '12px' }}
              />
              <Area type="monotone" dataKey="value" stroke="#60a5fa" strokeWidth={1.5} fill="url(#grad)" animationDuration={2000} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </GlassCard>

      <GlassCard>
        <h4 className="text-white font-medium mb-8">Threat Distribution</h4>
        <div className="space-y-7">
          {risks.length > 0 ? risks.map(r => (
            <div key={r.id} className="group cursor-pointer">
              <div className="flex justify-between text-[10px] mb-2 font-black tracking-[0.2em] text-zinc-500 uppercase">
                <span>{r.type}</span>
                <span className={r.status === 'CRITICAL' ? 'text-rose-500' : 'text-amber-500'}>{r.score || 0}%</span>
              </div>
              <div className="h-[1px] w-full bg-white/[0.05] overflow-hidden">
                <div 
                  className={`h-full transition-all duration-1000 ease-out ${r.status === 'CRITICAL' ? 'bg-rose-500' : 'bg-blue-400'}`} 
                  style={{ width: `${r.score || 0}%` }}
                />
              </div>
              <p className="text-sm text-zinc-400 mt-4 font-light group-hover:text-white transition-colors tracking-tight line-clamp-1">{r.title}</p>
            </div>
          )) : (
            <p className="text-xs text-zinc-600 italic">No active threats detected.</p>
          )}
        </div>
      </GlassCard>
    </div>
  </div>
);

const RiskExplorerView = ({ risks, onAddClick }) => (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 animate-in fade-in slide-in-from-bottom-4 duration-1000">
    {risks.map((risk) => (
      <GlassCard key={risk.id} className="flex flex-col hover:-translate-y-1">
        <div className="flex justify-between items-start mb-8">
          <div className={`px-2 py-0.5 rounded text-[9px] font-black tracking-widest border ${
            risk.status === 'CRITICAL' ? 'bg-rose-500/10 text-rose-500 border-rose-500/20' : 'bg-blue-400/10 text-blue-400 border-blue-400/20'
          }`}>
            {risk.status}
          </div>
          <Maximize2 size={14} className="text-zinc-700 cursor-pointer hover:text-white transition-colors" />
        </div>
        <h3 className="text-2xl text-white font-extralight tracking-tight mb-3">{risk.title}</h3>
        <p className="text-xs text-zinc-500 line-clamp-2 font-medium mb-8 leading-relaxed">{risk.description}</p>
        
        <div className="mt-auto grid grid-cols-2 gap-4 border-t border-white/[0.05] pt-6">
          <div>
            <p className="text-[9px] font-black text-zinc-600 uppercase tracking-widest mb-1">Impact Sector</p>
            <p className="text-[11px] text-white uppercase tracking-wider">{risk.industry}</p>
          </div>
          <div className="text-right">
            <p className="text-[9px] font-black text-zinc-600 uppercase tracking-widest mb-1">Exposure</p>
            <p className="text-[11px] text-white uppercase tracking-wider">₹{(risk.financialImpact?.revenueLoss / 1000).toFixed(0)}k</p>
          </div>
        </div>
      </GlassCard>
    ))}
    <div 
      onClick={onAddClick}
      className="border border-dashed border-white/[0.08] rounded-[20px] flex flex-col items-center justify-center p-8 group cursor-pointer hover:border-white/20 transition-all min-h-[250px]"
    >
      <div className="w-10 h-10 rounded-full bg-white/[0.03] flex items-center justify-center mb-4 group-hover:bg-white/[0.08] transition-all">
        <Plus className="text-zinc-500 group-hover:text-white" size={20} />
      </div>
      <p className="text-[10px] text-zinc-600 font-black uppercase tracking-widest">Register Threat</p>
    </div>
  </div>
);

// --- Add Risk Slide-over ---

const AddRiskPanel = ({ isOpen, onClose, onAdd }) => {
  const [form, setForm] = useState({ title: '', type: 'REGULATORY', industry: '', location: '', description: '', impact: 5, probability: 5, velocity: 5 });

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[200] flex justify-end">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-md bg-[#050505] border-l border-white/10 p-8 h-full shadow-2xl animate-in slide-in-from-right duration-500 flex flex-col">
        <div className="flex justify-between items-center mb-12">
          <h2 className="text-2xl font-extralight tracking-tighter text-white">Ingest Signal</h2>
          <button onClick={onClose} className="p-2 hover:bg-white/5 rounded-full transition-colors"><X size={20} /></button>
        </div>

        <div className="space-y-6 flex-1 overflow-y-auto pr-2 custom-scrollbar">
          <div className="space-y-2">
            <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">Signal Title</label>
            <input 
              type="text" 
              className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-white focus:border-blue-500 outline-none transition-colors"
              placeholder="Enter threat title..."
              value={form.title}
              onChange={e => setForm({...form, title: e.target.value})}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">Risk Category</label>
              <select 
                className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-white outline-none"
                value={form.type}
                onChange={e => setForm({...form, type: e.target.value})}
              >
                <option value="REGULATORY">REGULATORY</option>
                <option value="LOGISTICS">LOGISTICS</option>
                <option value="FISCAL">FISCAL</option>
                <option value="REPUTATION">REPUTATION</option>
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">Industry</label>
              <input 
                type="text" 
                className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-white"
                placeholder="Sector..."
                value={form.industry}
                onChange={e => setForm({...form, industry: e.target.value})}
              />
            </div>
          </div>

          <div className="space-y-4 pt-4">
             <div className="flex justify-between items-center">
                <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">Impact Magnitude</label>
                <span className="text-blue-400 font-mono text-xs">{form.impact}/10</span>
             </div>
             <input type="range" min="1" max="10" className="w-full h-1 bg-white/10 appearance-none rounded-full accent-blue-500" value={form.impact} onChange={e => setForm({...form, impact: e.target.value})} />
             
             <div className="flex justify-between items-center">
                <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">Probability Index</label>
                <span className="text-blue-400 font-mono text-xs">{form.probability}/10</span>
             </div>
             <input type="range" min="1" max="10" className="w-full h-1 bg-white/10 appearance-none rounded-full accent-blue-500" value={form.probability} onChange={e => setForm({...form, probability: e.target.value})} />
          </div>

          <div className="space-y-2 pt-4">
            <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">Briefing Context</label>
            <textarea 
              rows="4"
              className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-white outline-none"
              placeholder="Detailed intelligence report..."
              value={form.description}
              onChange={e => setForm({...form, description: e.target.value})}
            />
          </div>
        </div>

        <button 
          onClick={() => onAdd(form)}
          className="w-full mt-8 py-4 bg-white text-black text-[10px] font-black uppercase tracking-[0.3em] rounded-xl hover:bg-zinc-200 transition-all active:scale-95"
        >
          Initialize Standardization
        </button>
      </div>
    </div>
  );
};

// --- Main App Shell ---

export default function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [risks, setRisks] = useState([]);
  const [isAddPanelOpen, setIsAddPanelOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [isConnected, setIsConnected] = useState(false);

  const fetchRisks = async () => {
    setLoading(true);
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 3000); // 3s timeout

      const res = await fetch(`${API_BASE}/risks`, { signal: controller.signal });
      clearTimeout(timeoutId);
      
      if (!res.ok) throw new Error('Network response not ok');
      
      const data = await res.json();
      setRisks(data);
      setIsConnected(true);
    } catch (err) {
      console.warn("Connectivity issue with Intelligence Core. Falling back to Mock Intelligence.");
      // FALLBACK: If server is down, use mock data so the app stays functional for presentation
      setRisks(INITIAL_MOCK_RISKS);
      setIsConnected(false);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRisks();
  }, []);

  const handleAddRisk = async (formData) => {
    if (!isConnected) {
      // If offline, just add locally for demo purposes
      const newRisk = {
        ...formData,
        id: Date.now(),
        score: Math.round((formData.impact * formData.probability * 7) / 10),
        status: formData.impact > 7 ? 'CRITICAL' : 'WARNING',
        trend: [20, 30, 45, 60],
        financialImpact: { revenueLoss: formData.impact * 20000, marginErosion: 0.5 }
      };
      setRisks([newRisk, ...risks]);
      setIsAddPanelOpen(false);
      return;
    }

    try {
      const res = await fetch(`${API_BASE}/risks`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      if (res.ok) {
        setIsAddPanelOpen(false);
        fetchRisks(); // Reload
      }
    } catch (err) {
      console.error("Failed to ingest signal.");
    }
  };

  return (
    <div className="bg-[#000000] min-h-screen text-zinc-100 selection:bg-blue-500/40 pb-24 overflow-x-hidden">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@100;200;300;400;700;900&display=swap');
        body { font-family: 'Inter', sans-serif; background-color: #000; margin: 0; }
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-track { background: #000; }
        ::-webkit-scrollbar-thumb { background: #111; border-radius: 10px; }
        .animate-in { animation: animateIn 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
        @keyframes animateIn { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
        
        /* Range input styling */
        input[type='range']::-webkit-slider-thumb {
          -webkit-appearance: none;
          height: 14px;
          width: 14px;
          border-radius: 50%;
          background: #fff;
          cursor: pointer;
          box-shadow: 0 0 10px rgba(255, 255, 255, 0.3);
        }
      `}</style>

      {/* HUD Navigation */}
      <nav className="fixed top-8 left-1/2 -translate-x-1/2 z-[100] w-fit">
        <div className="bg-black/90 backdrop-blur-3xl border border-white/[0.08] rounded-full px-6 py-2.5 flex items-center space-x-10 shadow-2xl shadow-black/50">
          <div className="flex items-center space-x-3 mr-4 pr-6 border-r border-white/[0.08]">
            <div className="w-7 h-7 bg-white rounded-full flex items-center justify-center shadow-lg shadow-white/20">
              <ShieldAlert size={14} className="text-black" />
            </div>
            <span className="text-xs font-black tracking-tighter uppercase italic text-white">CB</span>
          </div>
          {[
            { id: 'dashboard', icon: LayoutDashboard, label: 'Vision' },
            { id: 'explorer', icon: Globe, label: 'Threats' },
            { id: 'simulator', icon: TrendingDown, label: 'Sim' },
            { id: 'consultant', icon: FileText, label: 'Brief' },
          ].map(tab => (
            <button 
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`relative flex flex-col items-center group transition-all ${activeTab === tab.id ? 'text-white' : 'text-zinc-600 hover:text-zinc-300'}`}
            >
              <tab.icon size={16} className="transition-transform group-hover:-translate-y-0.5" />
              <span className="text-[7px] font-black uppercase mt-1.5 tracking-[0.2em] opacity-0 group-hover:opacity-100 transition-opacity absolute top-6">{tab.label}</span>
              {activeTab === tab.id && <div className="absolute -bottom-2 w-1 h-1 bg-white rounded-full" />}
            </button>
          ))}
        </div>
      </nav>

      {/* Main Container */}
      <main className="max-w-[1400px] mx-auto pt-36 px-10">
        <div className="flex justify-between items-start mb-20">
          <div>
             <h1 className="text-[clamp(60px,10vw,140px)] font-thin tracking-tighter leading-[0.7] text-white select-none">
                Crisis<span className="text-zinc-400 font-extralight opacity-40">Board</span>
             </h1>
             <div className="mt-8 flex flex-wrap gap-6 items-center">
               <p className="text-zinc-500 font-mono text-[9px] uppercase tracking-[0.5em] flex items-center whitespace-nowrap">
                  <span className={`w-1.5 h-1.5 rounded-full mr-3 shadow-[0_0_10px_rgba(255,255,255,0.2)] ${loading ? 'bg-amber-500 animate-pulse' : isConnected ? 'bg-emerald-400' : 'bg-rose-500'}`}></span>
                  Status: {loading ? 'Syncing Intelligence...' : isConnected ? 'Intelligence Core Live' : 'Demo Mode (Offline)'}
               </p>
               <p className="text-zinc-700 font-mono text-[9px] uppercase tracking-[0.5em] whitespace-nowrap hidden sm:block">
                  Node: Alpha-7 // Lat: 28.6139° N
               </p>
             </div>
          </div>
          {!isConnected && !loading && (
            <button 
              onClick={fetchRisks}
              className="text-[10px] font-bold text-zinc-500 hover:text-white uppercase tracking-widest flex items-center border border-white/10 px-3 py-1.5 rounded-full transition-all"
            >
              <Wifi size={12} className="mr-2" /> Reconnect Core
            </button>
          )}
        </div>

        {activeTab === 'dashboard' && <DashboardView risks={risks} />}
        {activeTab === 'explorer' && <RiskExplorerView risks={risks} onAddClick={() => setIsAddPanelOpen(true)} />}
        {activeTab === 'simulator' && <div className="animate-in flex flex-col items-center justify-center py-20"><TrendingDown size={48} className="text-zinc-800 mb-4" /> <p className="text-zinc-500 italic tracking-tight">Intelligence Warp Active - Simulation data routed via Dashboard stats.</p></div>}
        {activeTab === 'consultant' && (
          <div className="flex flex-col items-center animate-in">
            <div className="w-full max-w-[800px] bg-white text-black p-12 md:p-20 shadow-2xl">
              <div className="flex justify-between items-start mb-12 border-b-2 border-black pb-8">
                <div>
                  <h1 className="text-5xl font-black italic tracking-tighter leading-none mb-1">BOARD BRIEF</h1>
                  <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-500">Ref: Alpha-9 // Confidential</p>
                </div>
                <div className="text-right">
                   <p className="text-xs font-bold uppercase">{new Date().toLocaleDateString()}</p>
                </div>
              </div>
              <p className="text-3xl font-extralight tracking-tight leading-snug">Signal analysis complete. Total Business Exposure identified at <span className="font-bold underline">₹{(risks.reduce((acc, r) => acc + (r.financialImpact?.revenueLoss || 0), 0) / 100000).toFixed(1)}L</span> across core sectors.</p>
            </div>
          </div>
        )}
      </main>

      <AddRiskPanel 
        isOpen={isAddPanelOpen} 
        onClose={() => setIsAddPanelOpen(false)} 
        onAdd={handleAddRisk} 
      />

      <div className="fixed inset-0 pointer-events-none opacity-[0.035] contrast-150 grayscale mix-blend-overlay z-[200]" 
           style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.7' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` }}>
      </div>
    </div>
  );
}
