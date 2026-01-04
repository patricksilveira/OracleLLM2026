
import React from 'react';
import { 
  Bot, 
  Sparkles, 
  Zap, 
  Search, 
  Cpu, 
  Globe, 
  Flag, 
  MapPin,
  TrendingUp,
  ShieldAlert,
  Terminal,
  Bitcoin,
  DollarSign,
  Trophy
} from 'lucide-react';
import { LLM, Category, Scope } from './types';

export const MODEL_CONFIG: Record<LLM, { color: string; bg: string; icon: React.ReactNode }> = {
  'Gemini': { 
    color: 'text-blue-400', 
    bg: 'bg-blue-500/10', 
    icon: <Sparkles className="w-4 h-4" /> 
  },
  'Claude': { 
    color: 'text-orange-400', 
    bg: 'bg-orange-500/10', 
    icon: <Bot className="w-4 h-4" /> 
  },
  'ChatGPT': { 
    color: 'text-emerald-400', 
    bg: 'bg-emerald-500/10', 
    icon: <Cpu className="w-4 h-4" /> 
  },
  'Perplexity': { 
    color: 'text-cyan-400', 
    bg: 'bg-cyan-500/10', 
    icon: <Search className="w-4 h-4" /> 
  },
  'Grok': { 
    color: 'text-slate-200', 
    bg: 'bg-slate-500/10', 
    icon: <Zap className="w-4 h-4" /> 
  },
};

export const CATEGORY_ICONS: Record<Category, React.ReactNode> = {
  'Politics': <Flag className="w-3.5 h-3.5" />,
  'War': <ShieldAlert className="w-3.5 h-3.5" />,
  'Tech': <Terminal className="w-3.5 h-3.5" />,
  'AI': <Cpu className="w-3.5 h-3.5" />,
  'Crypto': <Bitcoin className="w-3.5 h-3.5" />,
  'Finance & Economy': <DollarSign className="w-3.5 h-3.5" />,
  'Sports': <Trophy className="w-3.5 h-3.5" />,
};

export const SCOPE_ICONS: Record<Scope, React.ReactNode> = {
  'Brazil': <MapPin className="w-4 h-4" />,
  'Global': <Globe className="w-4 h-4" />,
  'Geopolitics': <TrendingUp className="w-4 h-4" />,
};
