import React, { useState, useMemo, useEffect, useCallback } from 'react';
import { Scope, Category, Prediction, LLM } from './types';
import { PREDICTIONS_DATA } from './data';
import { SCOPE_ICONS, CATEGORY_ICONS, MODEL_CONFIG } from './constants';
import { PredictionCard } from './components/PredictionCard';
import { Stats } from './components/Stats';
import { Methodology } from './components/Methodology';
import { PredictionDeepDive } from './components/PredictionDeepDive';
import { VerificationCenter } from './components/VerificationCenter';
import { Analytics } from "@vercel/analytics/react";
import { 
  LayoutGrid, 
  BarChart3, 
  Search, 
  Brain,
  Hash,
  BookOpen,
  Lock,
  Github,
  Unlock,
  ExternalLink,
  Linkedin,
  ShieldCheck
} from 'lucide-react';

const App: React.FC = () => {
  const [activeScope, setActiveScope] = useState<Scope | 'All'>('All');
  const [activeCategory, setActiveCategory] = useState<Category | 'All'>('All');
  const [activeModel, setActiveModel] = useState<LLM | 'All'>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'confidence' | 'newest'>('newest');
  const [isAdmin, setIsAdmin] = useState(false);
  const [showAdminLogin, setShowAdminLogin] = useState(false);
  const [adminPassword, setAdminPassword] = useState('');
  const [pendingQueueCount, setPendingQueueCount] = useState<number>(0);
  
  const [view, setView] = useState<'Grid' | 'Analytics' | 'Methodology' | 'Verification'>('Grid');
  const [predictions, setPredictions] = useState<Prediction[]>(PREDICTIONS_DATA);
  const [selectedPrediction, setSelectedPrediction] = useState<Prediction | null>(null);

  // Fetch updated predictions from backend store
  const loadPredictions = useCallback(async () => {
    try {
      const res = await fetch('/api/predictions');
      if (res.ok) {
        const data = await res.json();
        if (data.success && Array.isArray(data.predictions) && data.predictions.length > 0) {
          setPredictions(data.predictions);
        }
      }
    } catch {
      // Fallback to static data
    }
  }, []);

  // Fetch queue count
  const loadQueueCount = useCallback(async () => {
    try {
      const res = await fetch('/api/admin/status');
      if (res.ok) {
        const data = await res.json();
        if (data.success && data.status) {
          setPendingQueueCount(data.status.queueCount || 0);
        }
      }
    } catch {
      // Ignore
    }
  }, []);

  useEffect(() => {
    loadPredictions();
    loadQueueCount();
  }, [loadPredictions, loadQueueCount]);

  useEffect(() => {
    if (selectedPrediction || showAdminLogin) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
  }, [selectedPrediction, showAdminLogin]);

  const filteredPredictions = useMemo(() => {
    return predictions.filter(p => {
      const scopeMatch = activeScope === 'All' || p.scope === activeScope;
      const categoryMatch = activeCategory === 'All' || p.category === activeCategory;
      const modelMatch = activeModel === 'All' || p.model === activeModel;
      const searchMatch = searchQuery === '' || 
        p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.model.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.code.toLowerCase().includes(searchQuery.toLowerCase());
      
      return scopeMatch && categoryMatch && modelMatch && searchMatch;
    }).sort((a, b) => {
      if (sortBy === 'confidence') return b.confidence - a.confidence;
      return b.id.localeCompare(a.id);
    });
  }, [activeScope, activeCategory, activeModel, searchQuery, sortBy, predictions]);

  const summaryStats = useMemo(() => {
    const total = filteredPredictions.length;
    const confirmed = filteredPredictions.filter(p => p.status === 'Confirmed').length;
    const failed = filteredPredictions.filter(p => p.status === 'Debunked').length;
    const pending = filteredPredictions.filter(p => p.status === 'Pending').length;
    return { total, confirmed, failed, pending };
  }, [filteredPredictions]);

  const categories = useMemo(() => 
    (Array.from(new Set(predictions.map(p => p.category))) as string[]).sort(),
    [predictions]
  );
  
  const models: LLM[] = ['Gemini', 'Claude', 'ChatGPT', 'Perplexity', 'Grok'];
  const scopes: Scope[] = ['Brazil', 'Global', 'Geopolitics'];

  const handleStatusChange = (id: string, status: Prediction['status']) => {
    const updated = predictions.map(p => {
      if (p.id === id) {
        return { ...p, status };
      }
      return p;
    });
    setPredictions(updated);
    if (selectedPrediction?.id === id) {
      setSelectedPrediction({ ...selectedPrediction, status });
    }
  };

  const handleAdminLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password: adminPassword })
      });
      const data = await res.json();
      if (data.success) {
        setIsAdmin(true);
        setShowAdminLogin(false);
        setAdminPassword('');
        setView('Verification');
        loadQueueCount();
      } else {
        alert(data.message || 'Invalid code');
      }
    } catch {
      // Local fallback
      if (adminPassword === 'jb2GFPwfVHgBJWsB2J4Kao') {
        setIsAdmin(true);
        setShowAdminLogin(false);
        setAdminPassword('');
        setView('Verification');
      } else {
        alert('Invalid code');
      }
    }
  };

  const handlePredictionUpdated = (updated: Prediction) => {
    setPredictions(prev => prev.map(p => p.id === updated.id ? updated : p));
    if (selectedPrediction?.id === updated.id) {
      setSelectedPrediction(updated);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 pb-20 selection:bg-blue-500/30">
      <Analytics />
      <div className="fixed inset-0 overflow-hidden pointer-events-none opacity-20">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-600/30 blur-[120px] rounded-full" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-600/20 blur-[120px] rounded-full" />
      </div>

      <header className="relative pt-16 pb-12 px-6">
        <div className="max-w-7xl mx-auto text-center">
          <div 
            onClick={() => setShowAdminLogin(true)}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 mb-8 backdrop-blur-md cursor-pointer hover:bg-white/10 transition-colors"
          >
            <div className={`w-2 h-2 rounded-full ${isAdmin ? 'bg-purple-500 animate-pulse' : 'bg-emerald-500 animate-pulse'}`} />
            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-300">
              {isAdmin ? 'Oracle Admin Mode Active' : 'Live Prediction Tracking · Click for Admin'}
            </span>
          </div>

          <h1 
            className="text-6xl md:text-8xl font-black mb-6 tracking-tighter bg-clip-text text-transparent bg-gradient-to-b from-white to-slate-500 cursor-pointer select-none" 
            onClick={() => setView('Grid')}
            onDoubleClick={() => setShowAdminLogin(true)}
          >
            ORACLE <span className="text-blue-500">2026</span>
          </h1>
          <p className="text-slate-400 max-w-xl mx-auto font-medium text-sm md:text-base leading-relaxed">
            Benchmarking the foresight of the world's most powerful LLMs across strategic domains with automated monthly news verification.
          </p>
        </div>
      </header>

      {/* Admin Login Modal */}
      {showAdminLogin && (
        <div className="fixed inset-0 z-[120] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in duration-300">
          <div className="glass max-w-md w-full p-8 rounded-3xl border-white/10 shadow-2xl">
            <div className="flex items-center gap-3 mb-6">
              <Lock className="w-5 h-5 text-blue-500" />
              <h2 className="text-xl font-black uppercase tracking-tight text-white">Admin Authentication</h2>
            </div>
            <form onSubmit={handleAdminLogin} className="space-y-4">
              <input 
                type="password" 
                placeholder="Enter admin authorization code" 
                value={adminPassword}
                onChange={(e) => setAdminPassword(e.target.value)}
                autoFocus
                className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50 text-white"
              />
              <div className="flex gap-3">
                <button 
                  type="submit"
                  className="flex-grow bg-blue-600 hover:bg-blue-500 text-white font-black uppercase tracking-widest text-xs py-4 rounded-2xl transition-all"
                >
                  Verify Access
                </button>
                <button 
                  type="button" 
                  onClick={() => setShowAdminLogin(false)}
                  className="px-6 bg-white/5 hover:bg-white/10 text-slate-400 rounded-2xl transition-all"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Deep Dive Modal */}
      {selectedPrediction && (
        <PredictionDeepDive 
          prediction={selectedPrediction}
          onClose={() => setSelectedPrediction(null)}
          isAdmin={isAdmin}
          onStatusChange={handleStatusChange}
        />
      )}

      <main className="max-w-7xl mx-auto px-6">
        <div className="sticky top-4 z-50 mb-12">
          <div className="glass p-2 rounded-3xl shadow-2xl flex flex-col md:flex-row gap-4 items-center border-white/5">
            <div className="bg-white/5 rounded-2xl p-1 flex w-full md:w-auto">
              {[
                { id: 'Grid', icon: <LayoutGrid className="w-4 h-4" /> },
                { id: 'Analytics', icon: <BarChart3 className="w-4 h-4" /> },
                { id: 'Methodology', icon: <BookOpen className="w-4 h-4" /> },
                ...(isAdmin ? [{ 
                  id: 'Verification', 
                  icon: <ShieldCheck className="w-4 h-4 text-cyan-400" />,
                  badge: pendingQueueCount > 0 ? pendingQueueCount : undefined 
                }] : [])
              ].map(t => (
                <button 
                  key={t.id}
                  onClick={() => setView(t.id as any)}
                  className={`flex-1 md:flex-none px-4 py-2 rounded-xl text-xs font-black flex items-center justify-center gap-2 transition-all ${
                    view === t.id 
                      ? t.id === 'Verification' ? 'bg-cyan-600 text-white shadow-lg' : 'bg-blue-600 text-white shadow-lg' 
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {t.icon}
                  <span>{t.id === 'Verification' ? 'Verification Queue' : t.id}</span>
                  {t.badge !== undefined && (
                    <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-cyan-400 text-slate-950 font-extrabold">
                      {t.badge}
                    </span>
                  )}
                </button>
              ))}
            </div>

            {view !== 'Methodology' && view !== 'Verification' && (
              <>
                <div className="bg-white/5 rounded-2xl p-1 flex w-full md:w-auto overflow-x-auto no-scrollbar">
                  <button 
                    onClick={() => setActiveScope('All')}
                    className={`px-4 py-2 rounded-xl text-xs font-black transition-all ${activeScope === 'All' ? 'bg-white/10 text-white' : 'text-slate-500 hover:text-slate-300'}`}
                  >
                    All
                  </button>
                  {scopes.map(s => (
                    <button 
                      key={s}
                      onClick={() => setActiveScope(s)}
                      className={`px-4 py-2 rounded-xl text-xs font-black flex items-center gap-2 transition-all whitespace-nowrap ${activeScope === s ? 'bg-white/10 text-white' : 'text-slate-500 hover:text-slate-300'}`}
                    >
                      {SCOPE_ICONS[s]}
                      {s}
                    </button>
                  ))}
                </div>

                <div className="relative w-full md:w-auto md:flex-grow">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                  <input 
                    type="text"
                    placeholder="Search predictions..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-2xl pl-12 pr-4 py-2.5 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all placeholder:text-slate-600 text-white"
                  />
                </div>
              </>
            )}

            {isAdmin ? (
              <button 
                onClick={() => {
                  setIsAdmin(false);
                  if (view === 'Verification') setView('Grid');
                }}
                className="px-4 py-2.5 rounded-2xl bg-purple-500/20 text-purple-400 hover:bg-purple-500/30 transition-all flex items-center gap-2 text-xs font-bold shrink-0 border border-purple-500/30"
              >
                <Unlock className="w-3 h-3" />
                Logout Admin
              </button>
            ) : (
              <button
                onClick={() => setShowAdminLogin(true)}
                className="px-4 py-2.5 rounded-2xl bg-white/5 text-slate-400 hover:text-white hover:bg-white/10 transition-all flex items-center gap-2 text-xs font-semibold shrink-0"
              >
                <Lock className="w-3 h-3" />
                Admin
              </button>
            )}
          </div>
        </div>

        {view !== 'Methodology' && view !== 'Verification' && (
          <div className="flex flex-col gap-6 mb-12">
            <div className="flex items-center gap-4 overflow-x-auto pb-2 no-scrollbar">
              <div className="flex items-center gap-2 text-slate-500 shrink-0">
                <Brain className="w-3.5 h-3.5" />
                <span className="text-[10px] font-black uppercase tracking-wider">Models:</span>
              </div>
              <button 
                onClick={() => setActiveModel('All')}
                className={`px-3 py-1.5 rounded-full text-[10px] font-black tracking-widest transition-all border ${activeModel === 'All' ? 'bg-white text-slate-900 border-white' : 'bg-white/5 text-slate-500 border-white/5 hover:border-white/20'}`}
              >
                ALL MODELS
              </button>
              {models.map(m => (
                <button 
                  key={m}
                  onClick={() => setActiveModel(m)}
                  className={`px-3 py-1.5 rounded-full text-[10px] font-black tracking-widest flex items-center gap-2 transition-all border ${activeModel === m ? MODEL_CONFIG[m].bg + ' ' + MODEL_CONFIG[m].color + ' border-transparent' : 'bg-white/5 text-slate-500 border-white/5 hover:border-white/20'}`}
                >
                  {MODEL_CONFIG[m].icon}
                  {m.toUpperCase()}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-4 overflow-x-auto pb-2 no-scrollbar">
              <div className="flex items-center gap-2 text-slate-500 shrink-0">
                <Hash className="w-3.5 h-3.5" />
                <span className="text-[10px] font-black uppercase tracking-wider">Themes:</span>
              </div>
              <button 
                onClick={() => setActiveCategory('All')}
                className={`px-3 py-1.5 rounded-full text-[10px] font-black tracking-widest transition-all border ${activeCategory === 'All' ? 'bg-slate-100 text-slate-900 border-white' : 'bg-white/5 text-slate-500 border-white/5 hover:border-white/20'}`}
              >
                ALL THEMES
              </button>
              {categories.map(cat => (
                <button 
                  key={cat}
                  onClick={() => setActiveCategory(cat as Category)}
                  className={`px-3 py-1.5 rounded-full text-[10px] font-black tracking-widest flex items-center gap-2 transition-all border ${activeCategory === cat ? 'bg-blue-600/20 text-blue-400 border-blue-500/30 shadow-lg shadow-blue-500/10' : 'bg-white/5 text-slate-500 border-white/5 hover:border-white/20'}`}
                >
                  {CATEGORY_ICONS[cat as Category]}
                  {cat.toUpperCase()}
                </button>
              ))}
            </div>
          </div>
        )}

        {view === 'Grid' && (
          <div className="animate-in fade-in duration-500">
            {/* Summary Data Row */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
              <div className="bg-[#111827]/40 border border-slate-800/60 rounded-[20px] p-6 text-center">
                <div className="text-3xl font-black text-blue-400 mb-1">{summaryStats.total}</div>
                <div className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Predictions Tracked</div>
              </div>
              <div className="bg-[#111827]/40 border border-slate-800/60 rounded-[20px] p-6 text-center">
                <div className="text-3xl font-black text-emerald-400 mb-1">{summaryStats.confirmed}</div>
                <div className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Confirmed (Verified)</div>
              </div>
              <div className="bg-[#111827]/40 border border-slate-800/60 rounded-[20px] p-6 text-center">
                <div className="text-3xl font-black text-rose-400 mb-1">{summaryStats.failed}</div>
                <div className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Debunked / Missed</div>
              </div>
              <div className="bg-[#111827]/40 border border-slate-800/60 rounded-[20px] p-6 text-center">
                <div className="text-3xl font-black text-slate-400 mb-1">{summaryStats.pending}</div>
                <div className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Still Pending</div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredPredictions.map(p => (
                <PredictionCard 
                  key={p.id} 
                  prediction={p} 
                  onSelect={setSelectedPrediction} 
                  isAdmin={isAdmin}
                />
              ))}
            </div>
          </div>
        )}
        
        {view === 'Analytics' && <Stats predictions={filteredPredictions} />}
        {view === 'Methodology' && <Methodology />}
        {view === 'Verification' && (
          <VerificationCenter 
            predictions={predictions}
            onPredictionUpdated={handlePredictionUpdated}
            onRefreshAll={() => {
              loadPredictions();
              loadQueueCount();
            }}
          />
        )}
      </main>

      <footer className="mt-40 border-t border-white/5 pt-16 pb-12 px-6">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-12 items-start text-center md:text-left">
          <div>
            <div className="flex items-center justify-center md:justify-start gap-3 mb-6">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-700 flex items-center justify-center font-black text-white italic text-xl shadow-lg shadow-blue-500/20">O</div>
              <span className="font-black text-slate-200 tracking-tighter text-xl">LLM ORACLE</span>
            </div>
            <div className="space-y-3">
              <p className="text-sm text-slate-500 leading-relaxed font-medium">
                Evaluation project tracking AI forecasting accuracy with automated news verification.
              </p>
              <a 
                href="https://www.linkedin.com/in/patricksilveira/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-xs font-bold text-blue-400/80 hover:text-blue-400 transition-colors group"
              >
                <Linkedin className="w-3.5 h-3.5" />
                Project done by Patrick Silveira
                <ExternalLink className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
              </a>
            </div>
          </div>
          <div className="flex flex-col gap-4">
            <button onClick={() => setView('Methodology')} className="text-sm font-bold text-slate-500 hover:text-blue-400 transition-colors">Methodology</button>
            <button onClick={() => setView('Analytics')} className="text-sm font-bold text-slate-500 hover:text-blue-400 transition-colors">Analytics</button>
            <button onClick={() => setView('Grid')} className="text-sm font-bold text-slate-500 hover:text-blue-400 transition-colors">Grid</button>
            <button onClick={() => setShowAdminLogin(true)} className="text-sm font-bold text-cyan-500 hover:text-cyan-400 transition-colors">Admin Verification Center</button>
          </div>
          <div className="flex justify-center md:justify-end gap-4">
            <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="p-3 rounded-xl bg-white/5 text-slate-400 hover:text-white transition-all"><Github className="w-5 h-5" /></a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;