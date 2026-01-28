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
  Activity
} from 'lucide-react';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, Cell
} from 'recharts';

// --- Theme Constants ---
// Absolute Black Aesthetic
const THEME = {
  bg: 'bg-[#000000]',
  card: 'bg-[#080808] border border-white/[0.08] hover:border-white/[0.15] transition-all duration-500',
  accent: 'text-blue-400',
  textSecondary: 'text-zinc-500 font-medium tracking-tight',
};

// --- Mock Data ---
const INITIAL_RISKS = [
  { id: 1, type: 'REGULATORY', title: 'AI Act Compliance Delta', industry: 'Tech', location: 'EU', impact: 88, probability: 72, velocity: 94, status: 'CRITICAL', description: 'Immediate infrastructure audit required for LLM weights storage.', trend: [40, 50, 65, 88] },
  { id: 2, type: 'LOGISTICS', title: 'Suez Transit Bottleneck', industry: 'Retail', location: 'Global', impact: 62, probability: 81, velocity: 35, status: 'WARNING', description: 'Rerouting adding 14 days to lead times for Q4 stock.', trend: [30, 45, 42, 62] },
  { id: 3, type: 'FISCAL', title: 'INR/USD Volatility Spike', industry: 'Fintech', location: 'India', impact: 44, probability: 58, velocity: 78, status: 'ELEVATED', description: 'Hedging costs increasing; impact on offshore vendor payments.', trend: [20, 25, 38, 44] },
];

const COMPANY_PROFILE = {
  monthlyRevenue: 1500000,
  monthlyCosts: 1100000,
  margin: 26.6,
};

// --- UI Components ---

const GlassCard = ({ children, className = "" }) => (
  <div className={`${THEME.card} rounded-[20px] p-6 group relative overflow-hidden ${className}`}>
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
      <div className={`flex items-center text-[11px] font-bold ${trend > 0 ? 'text-rose-500' : 'text-emerald-500'}`}>
        {trend > 0 ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
        {Math.abs(trend)}%
      </div>
    </div>
  </GlassCard>
);

// --- Pages ---

const Dashboard = ({ risks }) => {
  return (
    <div className="space-y-4 animate-in fade-in slide-in-from-bottom-8 duration-1000">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <BentoStat label="Revenue Exposure" value="₹2.4M" trend={14.2} subtext="Direct threat to margin" />
        <BentoStat label="Risk Index" value="74" trend={2.1} subtext="Global aggregate score" />
        <BentoStat label="Active Signals" value="12" trend={-4} subtext="Unprocessed data points" />
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
              <AreaChart data={risks[0].trend.map((val, i) => ({ name: `T-${i}`, value: val }))}>
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
            {risks.map(r => (
              <div key={r.id} className="group cursor-pointer">
                <div className="flex justify-between text-[10px] mb-2 font-black tracking-[0.2em] text-zinc-500 uppercase">
                  <span>{r.type}</span>
                  <span className={r.status === 'CRITICAL' ? 'text-rose-500' : 'text-amber-500'}>{r.impact}%</span>
                </div>
                <div className="h-[1px] w-full bg-white/[0.05] overflow-hidden">
                  <div 
                    className={`h-full transition-all duration-1000 ease-out ${r.status === 'CRITICAL' ? 'bg-rose-500' : 'bg-blue-400'}`} 
                    style={{ width: `${r.impact}%` }}
                  />
                </div>
                <p className="text-sm text-zinc-400 mt-4 font-light group-hover:text-white transition-colors tracking-tight">{r.title}</p>
              </div>
            ))}
          </div>
        </GlassCard>
      </div>
    </div>
  );
};

const RiskExplorer = ({ risks }) => (
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
            <p className="text-[9px] font-black text-zinc-600 uppercase tracking-widest mb-1">Velocity</p>
            <p className="text-[11px] text-white uppercase tracking-wider">{risk.velocity} Mach</p>
          </div>
        </div>
      </GlassCard>
    ))}
    <div className="border border-dashed border-white/[0.08] rounded-[20px] flex flex-col items-center justify-center p-8 group cursor-pointer hover:border-white/20 transition-all">
      <div className="w-10 h-10 rounded-full bg-white/[0.03] flex items-center justify-center mb-4 group-hover:bg-white/[0.08] transition-all">
        <Plus className="text-zinc-500 group-hover:text-white" size={20} />
      </div>
      <p className="text-[10px] text-zinc-600 font-black uppercase tracking-widest">Register Threat</p>
    </div>
  </div>
);

const ImpactSimulator = ({ profile }) => {
  const [val, setVal] = useState(65);
  return (
    <div className="grid grid-cols-1 lg:grid-cols-5 gap-4 animate-in zoom-in-95 duration-1000">
      <GlassCard className="lg:col-span-3 min-h-[500px] flex flex-col justify-center">
        <div className="absolute top-8 left-8">
          <h4 className="text-2xl font-extralight text-white tracking-tighter italic">Probability Warp</h4>
          <p className="text-xs text-zinc-500 tracking-tight">Simulating margin erosion against global volatility.</p>
        </div>
        
        <div className="flex-1 flex flex-col justify-center px-12 pt-12">
           <div className="relative mb-24">
              <input 
                type="range" 
                className="w-full h-[2px] bg-white/[0.08] rounded-full appearance-none cursor-pointer accent-blue-400"
                value={val}
                onChange={(e) => setVal(e.target.value)}
              />
              <div className="absolute -top-14 left-1/2 -translate-x-1/2 text-7xl font-thin text-white/[0.03] select-none pointer-events-none">
                {val}%
              </div>
           </div>
           
           <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <p className="text-4xl font-extralight text-white mb-2 tracking-tighter">₹{(1.5 * (val/100)).toFixed(1)}M</p>
                <p className="text-[9px] font-black text-zinc-600 uppercase tracking-[0.2em]">Revenue Exposure</p>
              </div>
              <div>
                <p className="text-4xl font-extralight text-rose-500 mb-2 tracking-tighter">{(26.6 * (1 - val/200)).toFixed(1)}%</p>
                <p className="text-[9px] font-black text-zinc-600 uppercase tracking-[0.2em]">Projected Margin</p>
              </div>
              <div>
                <p className="text-4xl font-extralight text-zinc-400 mb-2 tracking-tighter">{(val/12).toFixed(1)}x</p>
                <p className="text-[9px] font-black text-zinc-600 uppercase tracking-[0.2em]">Risk Multiplier</p>
              </div>
           </div>
        </div>
      </GlassCard>

      <div className="lg:col-span-2">
        <GlassCard className="h-full">
           <h4 className="text-white font-medium mb-10 tracking-tight">AI Predictions</h4>
           <div className="space-y-10">
              {[
                { label: 'Supply Chain Shock', desc: 'Cascading failure in micro-logistics nodes.', prob: 'HIGH' },
                { label: 'Regulatory Drift', desc: 'Non-compliance window closing in 42 days.', prob: 'CRITICAL' },
                { label: 'Sentiment Flip', desc: 'Negative PR acceleration detected.', prob: 'LOW' },
              ].map((item, i) => (
                <div key={i} className="relative pl-6 border-l border-white/[0.05]">
                  <div className="absolute -left-1 top-0 w-2 h-2 rounded-full bg-blue-400 shadow-[0_0_15px_rgba(96,165,250,0.4)]" />
                  <p className="text-[9px] font-black text-zinc-600 uppercase tracking-widest mb-2">{item.prob} PROBABILITY</p>
                  <p className="text-lg font-light text-white mb-1 tracking-tight">{item.label}</p>
                  <p className="text-[11px] text-zinc-500 leading-relaxed font-medium">{item.desc}</p>
                </div>
              ))}
           </div>
        </GlassCard>
      </div>
    </div>
  );
};

const ConsultantMode = () => (
  <div className="animate-in fade-in duration-1000 flex flex-col items-center">
    <div className="w-full max-w-[800px] bg-white text-black p-20 min-h-[1000px] shadow-[0_0_100px_rgba(255,255,255,0.03)] selection:bg-black selection:text-white">
      <div className="flex justify-between items-start border-b-[4px] border-black pb-12 mb-12">
        <h1 className="text-6xl font-black tracking-tighter leading-none italic uppercase">CRISIS<br/>BOARD</h1>
        <div className="text-right">
          <p className="font-bold text-[10px] tracking-[0.3em] uppercase">Intelligence Protocol</p>
          <p className="text-xs font-medium mt-1">Ref: CB-ALPHA-9</p>
          <p className="text-xs font-medium">STATUS: LEVEL 5 CLEARANCE</p>
        </div>
      </div>
      
      <div className="space-y-12">
        <div>
          <h2 className="text-[10px] font-black bg-black text-white px-2 py-1 inline-block mb-8 uppercase tracking-[0.2em]">Executive Narrative</h2>
          <p className="text-3xl font-extralight leading-tight tracking-tight">
            Current data streams indicate a <span className="font-bold underline decoration-4 underline-offset-4">structural divergence</span> in market sensitivity. Immediate liquidity positioning is required to offset <span className="font-bold underline decoration-4 underline-offset-4">Tier-1 logistics volatility</span>.
          </p>
        </div>

        <div className="grid grid-cols-2 gap-16 pt-16 border-t border-black/10">
          <div>
            <h3 className="text-[10px] font-black uppercase mb-6 tracking-[0.3em] text-zinc-400">Exposure Matrix</h3>
            <div className="space-y-6">
              <div className="flex justify-between items-center border-b border-black/5 pb-3">
                <span className="text-sm font-bold">Audit Exposure</span>
                <span className="text-xl font-light">88%</span>
              </div>
              <div className="flex justify-between items-center border-b border-black/5 pb-3">
                <span className="text-sm font-bold">Route Latency</span>
                <span className="text-xl font-light">62%</span>
              </div>
            </div>
          </div>
          <div className="bg-zinc-50 p-8 rounded-sm">
             <h3 className="text-[10px] font-black uppercase mb-3 tracking-[0.3em] text-zinc-400">Strategic Pivot</h3>
             <p className="text-sm leading-relaxed italic text-zinc-800">
               "Deploying capital toward sovereign cloud infrastructure is no longer an option but a survival imperative for current EU operations."
             </p>
          </div>
        </div>
      </div>
    </div>
    <div className="mt-16 flex space-x-6">
      <button className="px-10 py-4 bg-white text-black text-[10px] font-black uppercase tracking-[0.3em] rounded-full hover:bg-zinc-200 transition-all">Export Protocol</button>
      <button className="px-10 py-4 border border-white/[0.1] text-white text-[10px] font-black uppercase tracking-[0.3em] rounded-full hover:bg-white/[0.05] transition-all">Secure Share</button>
    </div>
  </div>
);

// --- App Shell ---

export default function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [risks] = useState(INITIAL_RISKS);
  const [profile] = useState(COMPANY_PROFILE);

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard': return <Dashboard risks={risks} />;
      case 'explorer': return <RiskExplorer risks={risks} />;
      case 'simulator': return <ImpactSimulator profile={profile} />;
      case 'consultant': return <ConsultantMode />;
      default: return <Dashboard risks={risks} />;
    }
  };

  return (
    <div className={`${THEME.bg} min-h-screen text-zinc-100 selection:bg-blue-500/40 pb-24 lg:pb-0 overflow-x-hidden`}>
      {/* HUD Navigation */}
      <nav className="fixed top-8 left-1/2 -translate-x-1/2 z-[100] w-fit">
        <div className="bg-black/90 backdrop-blur-3xl border border-white/[0.08] rounded-full px-6 py-2.5 flex items-center space-x-10 shadow-2xl shadow-black/50">
          <div className="flex items-center space-x-3 mr-4 pr-6 border-r border-white/[0.08]">
            <div className="w-7 h-7 bg-white rounded-full flex items-center justify-center">
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
          
          <div className="pl-6 border-l border-white/[0.08] flex items-center space-x-5">
            <Bell size={16} className="text-zinc-600 hover:text-white cursor-pointer transition-colors" />
            <div className="w-8 h-8 rounded-full bg-zinc-900 border border-white/[0.05] overflow-hidden flex items-center justify-center text-[10px] font-bold text-zinc-400">
              JD
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content Area */}
      <main className="max-w-[1400px] mx-auto pt-36 px-10">
        <div className="flex justify-between items-start mb-20">
          <div>
             <h1 className="text-[140px] font-thin tracking-tighter leading-[0.7] text-white select-none">
                Crisis<span className="text-zinc-400 font-extralight opacity-40">Board</span>
             </h1>
             <div className="mt-8 flex items-center space-x-6">
               <p className="text-zinc-500 font-mono text-[9px] uppercase tracking-[0.5em] flex items-center">
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-400 mr-3 shadow-[0_0_10px_rgba(96,165,250,0.6)]"></span>
                  Active Node: Alpha-7
               </p>
               <p className="text-zinc-700 font-mono text-[9px] uppercase tracking-[0.5em]">
                  Lat: 28.6139° N / Long: 77.2090° E
               </p>
             </div>
          </div>
          <div className="hidden lg:block text-right">
            <p className="text-[9px] font-black text-zinc-700 uppercase tracking-[0.4em] mb-2">Global Sentiment Flux</p>
            <p className="text-3xl font-thin text-rose-500 italic tracking-tighter">-12.42%</p>
          </div>
        </div>

        {renderContent()}
      </main>

      {/* Grain/Noise Overlay for depth */}
      <div className="fixed inset-0 pointer-events-none opacity-[0.035] contrast-150 grayscale mix-blend-overlay z-[200]" 
           style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.7' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` }}>
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@100;200;300;400;700;900&display=swap');
        body { font-family: 'Inter', sans-serif; background: #000; }
        
        input[type='range']::-webkit-slider-thumb {
          -webkit-appearance: none;
          height: 12px;
          width: 12px;
          border-radius: 50%;
          background: #fff;
          cursor: pointer;
          box-shadow: 0 0 15px rgba(255, 255, 255, 0.4);
        }

        .animate-in { animation: animateIn 1.2s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
        @keyframes animateIn {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }

        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-track { background: #000; }
        ::-webkit-scrollbar-thumb { background: #111; border-radius: 10px; }
      `}} />
    </div>
  );
}
import { useEffect, useState } from "react";

export default function App() {
  const [risks, setRisks] = useState([]);

  useEffect(() => {
    fetch("http://localhost:4000/api/risks")
      .then(res => res.json())
      .then(data => setRisks(data))
      .catch(err => console.error(err));
  }, []);

  return (
    <div className="min-h-screen bg-black text-white p-6">
      <h1 className="text-3xl font-bold mb-4">CrisisBoard</h1>

      {risks.map(r => (
        <div
          key={r.id}
          className="mb-3 p-3 rounded border border-zinc-800"
        >
          <div className="font-semibold">{r.title}</div>
          <div className="text-sm text-zinc-400">
            {r.industry} • {r.type}
          </div>
          <div className="mt-1">
            Score: <span className="font-bold">{r.score}</span> ({r.level})
          </div>
        </div>
      ))}
    </div>
  );
}
