
import React, { useState } from 'react';
import { Prediction } from '../types';
import { MODEL_CONFIG, CATEGORY_ICONS } from '../constants';
import { CheckCircle, XCircle, Clock, ChevronDown, ChevronUp, BrainCircuit, Hash } from 'lucide-react';

interface PredictionCardProps {
  prediction: Prediction;
  onStatusChange: (id: string, status: Prediction['status']) => void;
  isAdmin?: boolean;
}

export const PredictionCard: React.FC<PredictionCardProps> = ({ prediction, onStatusChange, isAdmin }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const model = MODEL_CONFIG[prediction.model];
  
  const statusIcon = {
    'Pending': <Clock className="w-4 h-4 text-slate-400" />,
    'Success': <CheckCircle className="w-4 h-4 text-emerald-400" />,
    'Failed': <XCircle className="w-4 h-4 text-rose-400" />,
    'Partial': <div className="w-4 h-4 rounded-full border-2 border-amber-400 border-t-transparent animate-spin" />
  };

  const statusColors = {
    'Pending': 'bg-slate-500/10 text-slate-400',
    'Success': 'bg-emerald-500/10 text-emerald-400',
    'Failed': 'bg-rose-500/10 text-rose-400',
    'Partial': 'bg-amber-500/10 text-amber-400'
  };

  return (
    <div className="glass rounded-2xl p-5 transition-all duration-300 hover:border-blue-500/30 group flex flex-col h-full relative">
      <div className="flex justify-between items-start mb-4">
        <div className="flex flex-col gap-2">
           <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full w-fit ${model.bg}`}>
            <span className={model.color}>{model.icon}</span>
            <span className={`text-[10px] font-bold uppercase tracking-widest ${model.color}`}>{prediction.model}</span>
          </div>
          <div className="flex items-center gap-1 text-[10px] font-black text-slate-600 tracking-wider">
            <Hash className="w-3 h-3" />
            {prediction.code}
          </div>
        </div>
        <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[9px] font-black uppercase tracking-tighter ${statusColors[prediction.status]}`}>
          {statusIcon[prediction.status]}
          {prediction.status}
        </div>
      </div>

      <div className="flex items-center gap-2 mb-3">
        <span className="p-1.5 rounded-lg bg-white/5 text-slate-400">
          {CATEGORY_ICONS[prediction.category]}
        </span>
        <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">{prediction.category}</span>
        <span className="text-[10px] font-bold text-slate-600 ml-auto">{prediction.scope}</span>
      </div>

      <p className="text-slate-100 text-base leading-relaxed mb-4 font-medium flex-grow">
        "{prediction.content}"
      </p>

      {prediction.reasoning && (
        <div className="mb-4">
          <button 
            onClick={() => setIsExpanded(!isExpanded)}
            className="flex items-center gap-1.5 text-[10px] font-bold text-blue-400 uppercase tracking-widest hover:text-blue-300 transition-colors"
          >
            <BrainCircuit className="w-3 h-3" />
            {isExpanded ? 'Hide Reasoning' : 'View Reasoning'}
            {isExpanded ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
          </button>
          {isExpanded && (
            <div className="mt-3 p-3 rounded-xl bg-blue-500/5 border border-blue-500/10 text-xs text-slate-400 leading-relaxed italic animate-in fade-in slide-in-from-top-1">
              {prediction.reasoning}
            </div>
          )}
        </div>
      )}

      <div className="space-y-3 mt-auto pt-4 border-t border-white/5">
        <div className="flex justify-between items-center text-[10px]">
          <span className="text-slate-500 font-bold tracking-tight uppercase">AI Confidence</span>
          <span className="text-cyan-400 font-black">{prediction.confidence}%</span>
        </div>
        <div className="w-full bg-white/5 h-1 rounded-full overflow-hidden">
          <div 
            className="h-full bg-gradient-to-r from-blue-600 to-cyan-400 rounded-full"
            style={{ width: `${prediction.confidence}%` }}
          />
        </div>

        {isAdmin && (
          <div className="flex gap-2 pt-2 animate-in fade-in zoom-in-95">
            <button 
              onClick={() => onStatusChange(prediction.id, 'Success')}
              className={`flex-1 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-widest border transition-all ${prediction.status === 'Success' ? 'bg-emerald-500 text-white border-emerald-500 shadow-lg shadow-emerald-500/20' : 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20 hover:bg-emerald-500/20'}`}
            >
              Pass
            </button>
            <button 
              onClick={() => onStatusChange(prediction.id, 'Failed')}
              className={`flex-1 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-widest border transition-all ${prediction.status === 'Failed' ? 'bg-rose-500 text-white border-rose-500 shadow-lg shadow-rose-500/20' : 'bg-rose-500/10 text-rose-500 border-rose-500/20 hover:bg-rose-500/20'}`}
            >
              Fail
            </button>
            <button 
              onClick={() => onStatusChange(prediction.id, 'Pending')}
              className={`flex-1 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-widest border transition-all ${prediction.status === 'Pending' ? 'bg-slate-500 text-white border-slate-500 shadow-lg shadow-slate-500/20' : 'bg-slate-500/10 text-slate-500 border-slate-500/20 hover:bg-slate-500/20'}`}
            >
              Reset
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
