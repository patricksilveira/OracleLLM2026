
import React from 'react';
import { Prediction } from '../types';
import { MODEL_CONFIG, CATEGORY_ICONS } from '../constants';
import { CheckCircle2, XCircle, Clock, BrainCircuit, Hash, ArrowUpRight, Activity } from 'lucide-react';

interface PredictionCardProps {
  prediction: Prediction;
  onSelect: (prediction: Prediction) => void;
  isAdmin?: boolean;
}

export const PredictionCard: React.FC<PredictionCardProps> = ({ prediction, onSelect, isAdmin }) => {
  const model = MODEL_CONFIG[prediction.model];
  
  const statusIcon = {
    'Pending': <Clock className="w-3 h-3" />,
    'Confirmed': <CheckCircle2 className="w-3 h-3" />,
    'Debunked': <XCircle className="w-3 h-3" />,
    'Ongoing': <Activity className="w-3 h-3 animate-pulse" />
  };

  const statusColors = {
    'Pending': 'bg-slate-500/10 text-slate-400 border-slate-500/20',
    'Confirmed': 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
    'Debunked': 'bg-rose-500/10 text-rose-400 border-rose-500/20',
    'Ongoing': 'bg-blue-500/10 text-blue-400 border-blue-500/20'
  };

  return (
    <div 
      onClick={() => onSelect(prediction)}
      className="glass rounded-2xl p-5 transition-all duration-300 hover:border-blue-500/50 hover:bg-white/5 cursor-pointer group flex flex-col h-full relative border border-white/5"
    >
      <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
        <ArrowUpRight className="w-4 h-4 text-blue-400" />
      </div>

      <div className="flex justify-between items-start gap-4 mb-4">
        <div className="flex flex-col gap-2 min-w-0">
           <div className={`flex items-center gap-2 px-2.5 py-1 rounded-full w-fit ${model.bg}`}>
            <span className={model.color}>{model.icon}</span>
            <span className={`text-[9px] font-black uppercase tracking-widest ${model.color}`}>{prediction.model}</span>
          </div>
          <div className="flex items-center gap-1 text-[9px] font-black text-slate-500 tracking-wider truncate">
            <Hash className="w-3 h-3 shrink-0" />
            {prediction.code}
          </div>
        </div>
        <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest border shrink-0 whitespace-nowrap ${statusColors[prediction.status]}`}>
          <span className="flex items-center justify-center">{statusIcon[prediction.status]}</span>
          <span className="leading-none">{prediction.status}</span>
        </div>
      </div>

      <div className="flex items-center gap-2 mb-3">
        <span className="p-1.5 rounded-lg bg-white/5 text-slate-400 shrink-0">
          {CATEGORY_ICONS[prediction.category]}
        </span>
        <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 truncate">{prediction.category}</span>
        <span className="text-[9px] font-bold text-slate-600 ml-auto uppercase tracking-tighter shrink-0">{prediction.scope}</span>
      </div>

      <p className="text-slate-100 text-[15px] leading-relaxed mb-4 font-semibold flex-grow group-hover:text-white transition-colors">
        "{prediction.content}"
      </p>

      <div className="space-y-3 pt-4 border-t border-white/5 mt-auto">
        <div className="flex justify-between items-center text-[9px]">
          <span className="text-slate-500 font-bold tracking-widest uppercase">AI Confidence Score</span>
          <span className="text-blue-400 font-black">{prediction.confidence}%</span>
        </div>
        <div className="w-full bg-white/5 h-1 rounded-full overflow-hidden">
          <div 
            className="h-full bg-gradient-to-r from-blue-600 via-blue-400 to-cyan-300 rounded-full transition-all duration-500"
            style={{ width: `${prediction.confidence}%` }}
          />
        </div>

        <div className="flex items-center gap-1.5 text-[9px] font-black text-slate-600 uppercase tracking-widest group-hover:text-blue-400 transition-colors">
          <BrainCircuit className="w-3.5 h-3.5" />
          Tap to explore deep analysis
        </div>
      </div>
    </div>
  );
};
