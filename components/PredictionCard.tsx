
import React from 'react';
import { Prediction } from '../types';
import { MODEL_CONFIG, CATEGORY_ICONS } from '../constants';
import { Clock, CheckCircle2, XCircle, Activity, ChevronDown, Brain } from 'lucide-react';

interface PredictionCardProps {
  prediction: Prediction;
  onSelect: (prediction: Prediction) => void;
  isAdmin?: boolean;
}

export const PredictionCard: React.FC<PredictionCardProps> = ({ prediction, onSelect }) => {
  const model = MODEL_CONFIG[prediction.model];
  
  const statusIcon = {
    'Pending': <Clock className="w-3.5 h-3.5" />,
    'Confirmed': <CheckCircle2 className="w-3.5 h-3.5" />,
    'Debunked': <XCircle className="w-3.5 h-3.5" />,
    'Ongoing': <Activity className="w-3.5 h-3.5 animate-pulse" />
  };

  const statusColors = {
    'Pending': 'bg-slate-800/60 text-slate-400 border-slate-700/30',
    'Confirmed': 'bg-emerald-900/20 text-emerald-400 border-emerald-800/30',
    'Debunked': 'bg-rose-900/20 text-rose-400 border-rose-800/30',
    'Ongoing': 'bg-blue-900/20 text-blue-400 border-blue-800/30'
  };

  return (
    <div 
      onClick={() => onSelect(prediction)}
      className="bg-[#111827] border border-slate-800/60 rounded-[24px] p-6 flex flex-col h-full relative group transition-all duration-300 hover:border-cyan-500/30 shadow-xl cursor-pointer active:scale-[0.98] select-none"
    >
      {/* Header: Model & Status */}
      <div className="flex justify-between items-center mb-6 pointer-events-none">
        <div className={`flex items-center gap-2 px-4 py-1.5 rounded-full ${model.bg} ${model.color} border border-white/5 shadow-sm`}>
          {model.icon}
          <span className="text-[11px] font-black uppercase tracking-widest">{prediction.model}</span>
        </div>
        <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-wide border ${statusColors[prediction.status]}`}>
          {statusIcon[prediction.status]}
          {prediction.status}
        </div>
      </div>

      {/* Reference Code */}
      <div className="text-slate-600 text-[11px] font-bold uppercase tracking-widest mb-4 flex items-center gap-1.5 pointer-events-none">
        <span className="opacity-50 text-base font-medium">#</span> {prediction.code}
      </div>

      {/* Theme & Group */}
      <div className="flex justify-between items-center mb-6 border-b border-white/5 pb-4 pointer-events-none">
        <div className="flex items-center gap-2 text-slate-400">
          <div className="opacity-60">
            {CATEGORY_ICONS[prediction.category]}
          </div>
          <span className="text-[11px] font-black uppercase tracking-widest">{prediction.category}</span>
        </div>
        <span className="text-[11px] font-bold text-slate-600 uppercase tracking-widest">{prediction.scope}</span>
      </div>

      {/* Prediction Title (Text) */}
      <h3 className="text-white text-xl font-bold leading-snug mb-6 flex-grow pointer-events-none">
        {prediction.title}
      </h3>

      {/* View Reasoning Action Indicator */}
      <div 
        className="flex items-center gap-2 text-blue-400 group-hover:text-cyan-400 transition-colors mb-8"
      >
        <Brain className="w-4 h-4" />
        <span className="text-[11px] font-black uppercase tracking-widest">View Reasoning</span>
        <ChevronDown className="w-4 h-4 transition-transform group-hover:translate-y-0.5" />
      </div>

      {/* Footer: Confidence */}
      <div className="space-y-3 pointer-events-none">
        <div className="flex justify-between items-end">
          <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">AI Confidence</span>
          <span className="text-sm font-black text-cyan-400">{prediction.confidence}%</span>
        </div>
        <div className="w-full bg-slate-800/40 h-1.5 rounded-full overflow-hidden">
          <div 
            className="h-full bg-cyan-500 transition-all duration-1000 ease-out shadow-[0_0_10px_rgba(6,182,212,0.5)]"
            style={{ width: `${prediction.confidence}%` }}
          />
        </div>
      </div>
    </div>
  );
};
