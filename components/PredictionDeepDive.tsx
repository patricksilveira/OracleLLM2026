import React from 'react';
import { Prediction } from '../types';
import { MODEL_CONFIG, CATEGORY_ICONS } from '../constants';
import { 
  X, 
  Clock, 
  CheckCircle2, 
  XCircle, 
  Brain,
  Quote,
  ExternalLink,
  ShieldCheck,
  Calendar
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
    'Debunked': { icon: <XCircle className="w-4 h-4" />, color: 'text-rose-400', bg: 'bg-rose-900/20', border: 'border-rose-800/30' }
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
              <div className="text-slate-500 text-[11px] font-black uppercase tracking-[0.2em]">Ref: {prediction.code}</div>
            </div>
            
            <h2 className="text-2xl md:text-3xl font-bold text-white leading-tight">
              {prediction.title}
            </h2>
          </div>
          <button onClick={onClose} className="p-2 ml-4 rounded-xl hover:bg-white/10 text-slate-500 transition-all shrink-0">
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content Body */}
        <div className="flex-grow overflow-y-auto custom-scrollbar p-8 md:p-12 space-y-8">
          <div className="max-w-3xl mx-auto space-y-8">
            
            {/* Verification Audit Banner if Verified */}
            {(prediction.verifiedAt || (prediction.verifiedSources && prediction.verifiedSources.length > 0)) && (
              <div className="p-6 rounded-2xl bg-emerald-950/20 border border-emerald-800/40 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-emerald-400 font-semibold text-sm">
                    <ShieldCheck className="w-4 h-4" />
                    <span>Human-Verified Dossier</span>
                  </div>
                  {prediction.verifiedAt && (
                    <div className="flex items-center gap-1.5 text-xs text-slate-400 font-mono">
                      <Calendar className="w-3.5 h-3.5" />
                      <span>{new Date(prediction.verifiedAt).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}</span>
                    </div>
                  )}
                </div>

                {prediction.verifiedNotes && (
                  <p className="text-sm text-slate-200 leading-relaxed bg-black/30 p-4 rounded-xl border border-white/5">
                    {prediction.verifiedNotes}
                  </p>
                )}

                {prediction.verifiedSources && prediction.verifiedSources.length > 0 && (
                  <div className="space-y-2 pt-2">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">Verified News Sources</span>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {prediction.verifiedSources.map((source, idx) => (
                        <a
                          key={idx}
                          href={source.sourceUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center justify-between gap-2 p-3 rounded-lg bg-white/5 hover:bg-white/10 border border-white/5 transition-colors group"
                        >
                          <span className="text-xs text-slate-300 font-medium truncate group-hover:text-cyan-400">
                            {source.sourceTitle || source.sourceUrl}
                          </span>
                          <ExternalLink className="w-3.5 h-3.5 text-slate-500 shrink-0 group-hover:text-cyan-400" />
                        </a>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Original Strategic Analysis */}
            <div className="space-y-4">
              <div className="flex items-center gap-3 text-cyan-400">
                <Brain className="w-5 h-5" />
                <h4 className="text-[10px] font-black uppercase tracking-[0.4em]">Reasoning & Strategic Analysis</h4>
              </div>
              <div className="text-slate-300 text-base md:text-lg leading-relaxed font-normal bg-white/[0.02] p-8 rounded-3xl border border-white/5 relative">
                <Quote className="absolute top-4 right-4 w-8 h-8 text-white/5" />
                {prediction.description}
              </div>
            </div>

            {/* Metadata Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="p-6 rounded-3xl bg-white/5 border border-white/5">
                <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-4 block">Original Confidence</span>
                <div className="flex items-end gap-2">
                  <span className="text-4xl font-black text-cyan-400 tracking-tighter tabular-nums">{prediction.confidence}%</span>
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
              {(['Pending', 'Confirmed', 'Debunked'] as const).map(s => (
                <button
                  key={s}
                  onClick={() => onStatusChange?.(prediction.id, s)}
                  className={`px-4 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest border transition-all ${prediction.status === s ? 'bg-cyan-600 text-white border-cyan-500' : 'bg-white/5 text-slate-500 border-white/10 hover:text-slate-300'}`}
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
