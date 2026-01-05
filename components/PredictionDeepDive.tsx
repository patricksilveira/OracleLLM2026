
import React from 'react';
import { Prediction, EvidenceSource } from '../types';
import { MODEL_CONFIG, CATEGORY_ICONS } from '../constants';
import { 
  X, 
  Clock, 
  CheckCircle2, 
  XCircle, 
  Activity, 
  Hash, 
  ExternalLink, 
  Calendar, 
  Brain, 
  ShieldCheck, 
  Quote,
  Zap,
  ChevronRight
} from 'lucide-react';

interface PredictionDeepDiveProps {
  prediction: Prediction;
  onClose: () => void;
  isAdmin?: boolean;
  onStatusChange?: (id: string, status: Prediction['status']) => void;
}

export const PredictionDeepDive: React.FC<PredictionDeepDiveProps> = ({ 
  prediction, 
  onClose, 
  isAdmin,
  onStatusChange 
}) => {
  const model = MODEL_CONFIG[prediction.model];

  const statusConfig = {
    'Pending': { icon: <Clock />, color: 'text-slate-400', bg: 'bg-slate-500/10', border: 'border-slate-500/20' },
    'Confirmed': { icon: <CheckCircle2 />, color: 'text-emerald-400', bg: 'bg-emerald-500/10', border: 'border-emerald-500/20' },
    'Debunked': { icon: <XCircle />, color: 'text-rose-400', bg: 'bg-rose-500/10', border: 'border-rose-500/20' },
    'Ongoing': { icon: <Activity />, color: 'text-blue-400', bg: 'bg-blue-500/10', border: 'border-blue-500/20' }
  };

  const currentStatus = statusConfig[prediction.status];

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 md:p-8">
      <div 
        className="absolute inset-0 bg-black/90 backdrop-blur-xl animate-in fade-in duration-300" 
        onClick={onClose} 
      />
      
      <div className="relative glass w-full max-w-4xl max-h-[90vh] overflow-hidden rounded-[32px] border-white/10 shadow-2xl flex flex-col animate-in zoom-in-95 slide-in-from-bottom-4 duration-400">
        {/* Header Section */}
        <div className="p-6 md:p-10 border-b border-white/5 bg-gradient-to-br from-white/[0.02] to-transparent shrink-0">
          <div className="flex justify-between items-start mb-6">
            <div className="flex flex-col gap-4">
              <div className="flex items-center gap-3">
                <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full ${model.bg}`}>
                  <span className={model.color}>{model.icon}</span>
                  <span className={`text-[10px] font-black uppercase tracking-[0.2em] ${model.color}`}>{prediction.model}</span>
                </div>
                <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full border ${currentStatus.bg} ${currentStatus.color} ${currentStatus.border}`}>
                  <span className="w-4 h-4">{currentStatus.icon}</span>
                  <span className="text-[10px] font-black uppercase tracking-[0.2em]">{prediction.status}</span>
                </div>
              </div>
              <div className="flex items-center gap-3 text-slate-500">
                <div className="flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest bg-white/5 px-2.5 py-1 rounded-lg">
                  <Hash className="w-3 h-3" />
                  ID: {prediction.code}
                </div>
                <div className="flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest bg-white/5 px-2.5 py-1 rounded-lg">
                  {CATEGORY_ICONS[prediction.category]}
                  {prediction.category}
                </div>
                <div className="text-[10px] font-black uppercase tracking-widest bg-white/5 px-2.5 py-1 rounded-lg">
                  {prediction.scope}
                </div>
              </div>
            </div>
            <button 
              onClick={onClose}
              className="p-3 rounded-2xl bg-white/5 hover:bg-white/10 text-slate-400 transition-all hover:rotate-90"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          <div className="relative">
            <Quote className="absolute -top-4 -left-6 w-12 h-12 text-blue-500/20" />
            <h2 className="text-2xl md:text-3xl font-black text-white leading-tight">
              {prediction.content}
            </h2>
          </div>
        </div>

        {/* Scrollable Content */}
        <div className="flex-grow overflow-y-auto custom-scrollbar p-6 md:p-10 space-y-12">
          
          {/* Analysis Section */}
          <section className="space-y-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 rounded-xl bg-blue-500/10 border border-blue-500/20">
                <Brain className="w-5 h-5 text-blue-400" />
              </div>
              <h3 className="text-xs font-black text-slate-400 uppercase tracking-[0.3em]">AI Synthesis & Reasoning</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="md:col-span-2 space-y-6">
                <p className="text-slate-300 text-lg leading-relaxed font-medium italic">
                  {prediction.reasoning}
                </p>
                <div className="text-slate-400 leading-relaxed text-sm space-y-4">
                  <p>
                    {prediction.detailedAnalysis || "Analysis of emerging signals on January 3rd suggested high correlation between this outcome and the geopolitical pivot points currently observed in the region. The model indicates that secondary effects of fiscal policy will likely accelerate this trend by mid-2026."}
                  </p>
                </div>
              </div>
              <div className="space-y-6">
                <div className="glass p-6 rounded-3xl border-white/5 bg-blue-600/5">
                  <div className="flex justify-between items-center mb-4">
                    <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Confidence</span>
                    <span className="text-xl font-black text-blue-400">{prediction.confidence}%</span>
                  </div>
                  <div className="w-full bg-white/5 h-2 rounded-full overflow-hidden mb-4">
                    <div 
                      className="h-full bg-gradient-to-r from-blue-600 to-cyan-400 transition-all duration-1000"
                      style={{ width: `${prediction.confidence}%` }}
                    />
                  </div>
                  <p className="text-[10px] leading-relaxed text-slate-500 font-bold uppercase tracking-tight">
                    Model reports high certainty based on 2024-2025 trajectory patterns.
                  </p>
                </div>
                <div className="flex flex-col gap-3">
                   <div className="flex items-center justify-between text-[10px] font-black uppercase text-slate-600 border-b border-white/5 pb-2">
                    <span>Forecast Date</span>
                    <span className="text-slate-300">Jan 03, 2026</span>
                  </div>
                  <div className="flex items-center justify-between text-[10px] font-black uppercase text-slate-600 border-b border-white/5 pb-2">
                    <span>Last Monitored</span>
                    <span className="text-slate-300">Jan 04, 2026</span>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Evidence Section */}
          <section className="space-y-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
                <ShieldCheck className="w-5 h-5 text-emerald-400" />
              </div>
              <h3 className="text-xs font-black text-slate-400 uppercase tracking-[0.3em]">Verification & Evidence</h3>
            </div>
            
            {prediction.status === 'Pending' ? (
              <div className="p-10 rounded-[32px] border border-dashed border-white/10 flex flex-col items-center justify-center text-center space-y-4">
                <Zap className="w-10 h-10 text-slate-700" />
                <p className="text-slate-500 font-bold text-sm">
                  This prediction remains active. <br/>
                  <span className="text-[10px] uppercase tracking-widest font-black text-slate-600">Scanning for news signals daily...</span>
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {prediction.evidence?.map((item, idx) => (
                  <a 
                    key={idx}
                    href={item.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-between p-4 rounded-2xl bg-white/5 border border-white/10 hover:border-emerald-500/30 hover:bg-emerald-500/5 transition-all group"
                  >
                    <div className="flex flex-col gap-1">
                      <span className="text-[9px] font-black text-emerald-400 uppercase tracking-widest flex items-center gap-1">
                        {item.sourceName} <ChevronRight className="w-2 h-2" /> {item.date}
                      </span>
                      <span className="text-sm font-bold text-slate-200 line-clamp-1 group-hover:text-white">{item.title}</span>
                    </div>
                    <ExternalLink className="w-4 h-4 text-slate-600 group-hover:text-emerald-400" />
                  </a>
                ))}
              </div>
            )}
          </section>

          {isAdmin && (
            <section className="pt-8 border-t border-white/10">
              <h3 className="text-[10px] font-black text-purple-400 uppercase tracking-[0.3em] mb-6">Oracle Admin Control</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {(['Pending', 'Confirmed', 'Debunked', 'Ongoing'] as const).map(s => (
                  <button
                    key={s}
                    onClick={() => onStatusChange?.(prediction.id, s)}
                    className={`px-4 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest border transition-all ${prediction.status === s ? 'bg-purple-600 text-white border-purple-500 shadow-lg' : 'bg-white/5 text-slate-500 border-white/10 hover:border-purple-500/30'}`}
                  >
                    Set {s}
                  </button>
                ))}
              </div>
            </section>
          )}
        </div>

        {/* Action Footer */}
        <div className="p-6 border-t border-white/5 bg-slate-900/50 flex justify-between items-center shrink-0">
          <button 
            onClick={onClose}
            className="px-8 py-3 rounded-2xl bg-white/5 text-slate-400 text-[10px] font-black uppercase tracking-widest hover:text-white transition-all"
          >
            Close Drill-Down
          </button>
          <div className="flex items-center gap-3">
             <span className="text-[10px] font-black text-slate-600 uppercase tracking-widest">Share Oracle Record</span>
             <button className="p-2.5 rounded-xl bg-white/5 text-slate-400 hover:text-blue-400 transition-all">
                <ExternalLink className="w-4 h-4" />
             </button>
          </div>
        </div>
      </div>
    </div>
  );
};
