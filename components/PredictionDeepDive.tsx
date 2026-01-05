
import React from 'react';
import { Prediction } from '../types';
import { MODEL_CONFIG, CATEGORY_ICONS } from '../constants';
import { 
  X, 
  Clock, 
  CheckCircle2, 
  XCircle, 
  Activity, 
  Brain,
  Quote
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
    'Pending': { icon: <Clock className="w-4 h-4" />, color: 'text-slate-400', bg: 'bg-slate-800', border: 'border-slate-700' },
    'Confirmed': { icon: <CheckCircle2 className="w-4 h-4" />, color: 'text-emerald-400', bg: 'bg-emerald-900/20', border: 'border-emerald-800/30' },
    'Debunked': { icon: <XCircle className="w-4 h-4" />, color: 'text-rose-400', bg: 'bg-rose-900/20', border: 'border-rose-800/30' },
    'Ongoing': { icon: <Activity className="w-4 h-4" />, color: 'text-blue-400', bg: 'bg-blue-900/20', border: 'border-blue-800/30' }
  };

  const currentStatus = statusConfig[prediction.status];

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 md:p-8">
      <div className="absolute inset-0 bg-slate-950/98 backdrop-blur-xl animate-in fade-in" onClick={onClose} />
      
      <div className="relative bg-[#0f172a] w-full max-w-4xl max-h-[90vh] overflow-hidden rounded-[32px] border border-white/10 shadow-2xl flex flex-col animate-in zoom-in-95">
        
        {/* Header */}
        <div className="p-8 md:p-10 border-b border-white/5 shrink-0 flex justify-between items-start bg-slate-900/40">
          <div className="space-y-4 w-full">
            <div className="flex justify-between items-center w-full">
               <div className={`flex items-center gap-2 px-4 py-1.5 rounded-full ${model.bg} ${model.color} border border-white/5`}>
                {model.icon}
                <span className="text-[11px] font-black uppercase tracking-widest">{prediction.model}</span>
              </div>
              <div className="text-slate-600 text-[11px] font-black uppercase tracking-[0.2em]">Ref: {prediction.code}</div>
            </div>
            
            <h2 className="text-2xl md:text-3xl font-bold text-white leading-tight italic">
              {prediction.title}
            </h2>
          </div>
          <button onClick={onClose} className="p-2 ml-4 rounded-xl hover:bg-white/10 text-slate-500 transition-all shrink-0">
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content Body */}
        <div className="flex-grow overflow-y-auto custom-scrollbar p-8 md:p-12">
          <div className="max-w-2xl mx-auto space-y-12">
            <div className="space-y-6">
              <div className="flex items-center gap-3 text-cyan-400">
                <Brain className="w-5 h-5" />
                <h4 className="text-[10px] font-black uppercase tracking-[0.4em]">Reasoning & Strategic Analysis</h4>
              </div>
              <div className="text-slate-300 text-lg leading-relaxed font-medium bg-white/[0.02] p-8 rounded-3xl border border-white/5 relative">
                <Quote className="absolute top-4 right-4 w-8 h-8 text-white/5" />
                {prediction.description}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="p-6 rounded-3xl bg-white/5 border border-white/5">
                <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-4 block">AI Confidence Score</span>
                <div className="flex items-end gap-2">
                  <span className="text-4xl font-black text-cyan-400 tracking-tighter">{prediction.confidence}%</span>
                </div>
                <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden mt-4">
                  <div className="h-full bg-cyan-500 shadow-[0_0_8px_rgba(6,182,212,0.4)]" style={{ width: `${prediction.confidence}%` }} />
                </div>
              </div>

              <div className="p-6 rounded-3xl bg-white/5 border border-white/5">
                <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-4 block">Classification</span>
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <div className="p-1.5 rounded-lg bg-white/5 text-slate-400">
                      {CATEGORY_ICONS[prediction.category]}
                    </div>
                    <span className="text-xs font-bold text-slate-300">{prediction.category} / {prediction.scope}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Modal Footer (Admin) */}
        <div className="p-8 border-t border-white/5 bg-slate-900/60 flex flex-col md:flex-row justify-between items-center gap-4 shrink-0">
          <div className="flex items-center gap-4">
            <div className={`flex items-center gap-2 px-4 py-2 rounded-full border ${currentStatus.bg} ${currentStatus.color} ${currentStatus.border} text-[10px] font-black uppercase tracking-widest`}>
              {currentStatus.icon}
              {prediction.status}
            </div>
          </div>
          
          {isAdmin && (
            <div className="flex gap-2">
              {(['Pending', 'Confirmed', 'Debunked', 'Ongoing'] as const).map(s => (
                <button
                  key={s}
                  onClick={() => onStatusChange?.(prediction.id, s)}
                  className={`px-4 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest border transition-all ${prediction.status === s ? 'bg-cyan-600 text-white border-cyan-500' : 'bg-white/5 text-slate-500 border-white/10'}`}
                >
                  {s}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
