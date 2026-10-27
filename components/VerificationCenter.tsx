import React, { useState, useEffect } from 'react';
import { 
  VerificationDossier, 
  Prediction, 
  MonthlyVerificationRun, 
  Status, 
  Scope,
  LLM,
  QueueScanState,
  QueueScanLog
} from '../types';
import { MODEL_CONFIG } from '../constants';
import { 
  CheckCircle2, 
  Clock, 
  Search, 
  Sparkles, 
  ExternalLink, 
  RefreshCw, 
  Play, 
  Check, 
  Edit3, 
  Calendar, 
  Filter, 
  History, 
  AlertTriangle,
  Link,
  Send,
  Sliders,
  ChevronDown,
  ChevronUp,
  Pause,
  RotateCcw,
  Square,
  ListOrdered,
  Terminal,
  ShieldCheck
} from 'lucide-react';


interface VerificationCenterProps {
  predictions: Prediction[];
  onPredictionUpdated: (updatedPrediction: Prediction) => void;
  onRefreshAll: () => void;
}

export const VerificationCenter: React.FC<VerificationCenterProps> = ({
  predictions,
  onPredictionUpdated,
  onRefreshAll
}) => {
  const [activeTab, setActiveTab] = useState<'queue' | 'approved' | 'history' | 'single'>('queue');
  const [queue, setQueue] = useState<VerificationDossier[]>([]);
  const [runs, setRuns] = useState<MonthlyVerificationRun[]>([]);
  const [loading, setLoading] = useState(false);
  const [batchRunning, setBatchRunning] = useState(false);
  const [scanState, setScanState] = useState<QueueScanState | null>(null);
  const [showLogs, setShowLogs] = useState<boolean>(true);
  const [progressInfo, setProgressInfo] = useState<{ current: number; total: number; currentPrediction?: string; currentModel?: string } | null>(null);

  // Systematic Filter & Batch Controls
  const [targetScope, setTargetScope] = useState<Scope | 'All'>('All');
  const [targetModel, setTargetModel] = useState<LLM | 'All'>('All');
  const [batchSize, setBatchSize] = useState<number>(5);

  // Custom URL input per card
  const [expandedUrlInput, setExpandedUrlInput] = useState<string | null>(null);
  const [cardCustomUrl, setCardCustomUrl] = useState<string>('');
  const [urlAnalyzingId, setUrlAnalyzingId] = useState<string | null>(null);

  // Custom Search Terms per card
  const [expandedSearchInput, setExpandedSearchInput] = useState<string | null>(null);
  const [cardCustomSearchTerms, setCardCustomSearchTerms] = useState<string>('');
  const [searchAnalyzingId, setSearchAnalyzingId] = useState<string | null>(null);

  // Single verifier state
  const [singlePredId, setSinglePredId] = useState<string>('');
  const [singleCustomUrl, setSingleCustomUrl] = useState<string>('');
  const [singleCustomSearchTerms, setSingleCustomSearchTerms] = useState<string>('');
  const [singleLoading, setSingleLoading] = useState(false);
  const [singleResult, setSingleResult] = useState<VerificationDossier | null>(null);
  const [singleError, setSingleError] = useState<string | null>(null);

  // Modal / Inline Edit for Modify & Approve
  const [editingDossier, setEditingDossier] = useState<VerificationDossier | null>(null);
  const [modifiedStatus, setModifiedStatus] = useState<Status>('Confirmed');
  const [adminNotes, setAdminNotes] = useState<string>('');
  const [actionInProgress, setActionInProgress] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const fetchQueue = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/admin/queue');
      const data = await res.json();
      if (data.success) {
        setQueue(data.queue);
      }
    } catch (e) {
      console.error('Failed to fetch queue:', e);
    } finally {
      setLoading(false);
    }
  };

  const fetchRuns = async () => {
    try {
      const res = await fetch('/api/admin/runs');
      const data = await res.json();
      if (data.success) {
        setRuns(data.runs);
      }
    } catch (e) {
      console.error('Failed to fetch runs:', e);
    }
  };

  const fetchScanState = async () => {
    try {
      const res = await fetch('/api/admin/scan/state');
      const data = await res.json();
      if (data.success) {
        setScanState(data.scanState);
        setBatchRunning(data.scanState?.isScanning || false);
        if (data.status?.progress) {
          setProgressInfo(data.status.progress);
        }
      }
    } catch (e) {
      console.error('Failed fetching scan state:', e);
    }
  };

  useEffect(() => {
    fetchQueue();
    fetchRuns();
    fetchScanState();

    // Poll scan state and queue
    const interval = setInterval(() => {
      fetchScanState();
      fetchQueue();
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  const handleStartSystematicScan = async (fullScanAllPending: boolean = true) => {
    try {
      setBatchRunning(true);
      const res = await fetch('/api/admin/scan/start', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          scope: fullScanAllPending ? 'All' : targetScope,
          model: fullScanAllPending ? 'All' : targetModel,
          unverifiedOnly: true
        })
      });
      const data = await res.json();
      if (data.success) {
        setScanState(data.scanState);
        showToast(data.message || 'Systematic scan started for all pending predictions!');
      } else {
        alert(data.message || 'Failed to start scan');
        setBatchRunning(false);
      }
    } catch (e: any) {
      alert(e.message || 'Network error');
      setBatchRunning(false);
    }
  };

  const handlePauseScan = async () => {
    try {
      const res = await fetch('/api/admin/scan/pause', { method: 'POST' });
      const data = await res.json();
      if (data.success) {
        setScanState(data.scanState);
        setBatchRunning(false);
        showToast('Scan paused. Queue position preserved.');
      }
    } catch (e: any) {
      alert(e.message || 'Failed to pause scan');
    }
  };

  const handleResumeScan = async () => {
    try {
      const res = await fetch('/api/admin/scan/resume', { method: 'POST' });
      const data = await res.json();
      if (data.success) {
        setScanState(data.scanState);
        setBatchRunning(true);
        showToast('Scan resumed from current item.');
      }
    } catch (e: any) {
      alert(e.message || 'Failed to resume scan');
    }
  };

  const handleCancelScan = async () => {
    try {
      const res = await fetch('/api/admin/scan/cancel', { method: 'POST' });
      const data = await res.json();
      if (data.success) {
        setScanState(data.scanState);
        setBatchRunning(false);
        showToast('Systematic scan cancelled.');
      }
    } catch (e: any) {
      alert(e.message || 'Failed to cancel');
    }
  };

  const handleResetScan = async () => {
    if (!window.confirm('Reset systematic queue scan status and counter to 0?')) return;
    try {
      const res = await fetch('/api/admin/scan/reset', { method: 'POST' });
      const data = await res.json();
      if (data.success) {
        setScanState(data.scanState);
        setBatchRunning(false);
        showToast('Queue scan reset.');
      }
    } catch (e: any) {
      alert(e.message || 'Failed to reset queue');
    }
  };


  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4500);
  };

  const handleApplyReview = async (
    dossierId: string, 
    action: 'approve' | 'modify' | 'reject' | 'keep_pending',
    status?: Status,
    notes?: string
  ) => {
    try {
      setActionInProgress(dossierId);
      const res = await fetch('/api/admin/review', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          dossierId,
          action,
          status,
          adminNotes: notes
        })
      });

      const data = await res.json();
      if (data.success) {
        setQueue(data.queue);
        if (data.prediction) {
          onPredictionUpdated(data.prediction);
        }
        onRefreshAll();
        showToast(
          action === 'approve' 
            ? 'Verdict approved and applied to public scorecard!' 
            : action === 'modify' 
            ? 'Updated status approved and published!' 
            : 'Decision recorded.'
        );
        setEditingDossier(null);
      } else {
        alert(data.message || 'Action failed');
      }
    } catch (err) {
      console.error('Review submit error:', err);
      alert('Network error submitting review');
    } finally {
      setActionInProgress(null);
    }
  };

  const handleTriggerSystematicBatch = async () => {
    try {
      setBatchRunning(true);
      const res = await fetch('/api/admin/batch-verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          scope: targetScope,
          model: targetModel,
          batchSize: batchSize,
          unverifiedOnly: true
        })
      });
      const data = await res.json();
      if (data.success) {
        showToast(`Verification run started for ${targetModel === 'All' ? 'all models' : targetModel} (${targetScope})! Scanning news...`);
      } else {
        alert(data.message || 'Batch trigger failed');
        setBatchRunning(false);
      }
    } catch (e) {
      console.error('Batch trigger error:', e);
      setBatchRunning(false);
    }
  };

  // Verify prediction using user-informed custom URL
  const handleVerifyWithCustomUrl = async (predictionId: string, url: string) => {
    if (!url.trim()) return;

    try {
      setUrlAnalyzingId(predictionId);
      const res = await fetch('/api/admin/verify-with-url', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ predictionId, url: url.trim() })
      });
      const data = await res.json();

      if (data.success) {
        fetchQueue();
        showToast(`Analyzed ${data.dossier.predictionCode} using your provided URL!`);
        setCardCustomUrl('');
        setExpandedUrlInput(null);
      } else {
        alert(data.message || 'Custom URL verification failed');
      }
    } catch (err: any) {
      alert(err.message || 'Failed connecting to server');
    } finally {
      setUrlAnalyzingId(null);
    }
  };

  // Verify prediction using user-informed custom search terms
  const handleVerifyWithCustomTerms = async (predictionId: string, terms: string) => {
    if (!terms.trim()) return;

    try {
      setSearchAnalyzingId(predictionId);
      const res = await fetch('/api/admin/verify-single', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ predictionId, customSearchTerms: terms.trim() })
      });
      const data = await res.json();

      if (data.success) {
        fetchQueue();
        showToast(`Searched news for ${data.dossier.predictionCode} using custom query!`);
        setCardCustomSearchTerms('');
        setExpandedSearchInput(null);
      } else {
        alert(data.message || 'Custom term search failed');
      }
    } catch (err: any) {
      alert(err.message || 'Failed connecting to server');
    } finally {
      setSearchAnalyzingId(null);
    }
  };

  const handleVerifySingle = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!singlePredId) return;

    try {
      setSingleLoading(true);
      setSingleError(null);
      setSingleResult(null);

      const endpoint = singleCustomUrl.trim() ? '/api/admin/verify-with-url' : '/api/admin/verify-single';
      const body: any = { predictionId: singlePredId };
      if (singleCustomUrl.trim()) body.url = singleCustomUrl.trim();
      if (singleCustomSearchTerms.trim()) body.customSearchTerms = singleCustomSearchTerms.trim();

      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      });
      const data = await res.json();

      if (data.success) {
        setSingleResult(data.dossier);
        fetchQueue();
        showToast(`Fact check completed for ${data.dossier.predictionCode}`);
      } else {
        setSingleError(data.message || 'Verification failed');
      }
    } catch (err: any) {
      setSingleError(err.message || 'Network error');
    } finally {
      setSingleLoading(false);
    }
  };

  const pendingQueue = queue.filter(q => q.reviewStatus === 'pending_review');
  const approvedQueue = queue.filter(q => q.reviewStatus === 'approved' || q.reviewStatus === 'modified');

  const filteredQueue = pendingQueue.filter(item => {
    const scopeMatch = targetScope === 'All' || item.scope === targetScope;
    const modelMatch = targetModel === 'All' || item.model === targetModel;
    return scopeMatch && modelMatch;
  });

  const unverifiedCountForSelected = predictions.filter(p => {
    const isPending = p.status === 'Pending';
    const scopeMatch = targetScope === 'All' || p.scope === targetScope;
    const modelMatch = targetModel === 'All' || p.model === targetModel;
    return isPending && scopeMatch && modelMatch;
  }).length;

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-[120] bg-emerald-950 border border-emerald-600/50 text-emerald-200 px-5 py-3 rounded-xl shadow-2xl flex items-center gap-3 text-xs font-semibold animate-in slide-in-from-bottom-3">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Header Banner & Automation Control Panel */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 md:p-8 backdrop-blur-md space-y-6">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-6 border-b border-slate-800">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold text-cyan-400 uppercase tracking-widest mb-1.5">
              <span>Admin Console</span>
              <span className="text-slate-600">/</span>
              <span>Systematic Verification Engine</span>
            </div>
            <h2 className="text-2xl font-bold text-white tracking-tight">
              Monthly Prediction News Verification
            </h2>
            <p className="text-sm text-slate-400 mt-1 max-w-2xl">
              Evaluates both Title and Detailed Reasoning against current news and custom article URLs. All verdicts pass through human review.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => { fetchQueue(); fetchRuns(); fetchScanState(); }}
              disabled={loading}
              className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-200 transition-colors border border-slate-700"
              title="Refresh queue"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin text-cyan-400' : ''}`} />
              <span>Refresh</span>
            </button>

            {scanState?.isScanning ? (
              <div className="flex items-center gap-2">
                <button
                  onClick={handlePauseScan}
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-amber-600/30 hover:bg-amber-600/50 text-amber-200 border border-amber-500/40 text-xs font-bold transition-all shadow-md"
                >
                  <Pause className="w-3.5 h-3.5 fill-current" />
                  <span>Pause</span>
                </button>
                <button
                  onClick={handleCancelScan}
                  className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-rose-950/40 hover:bg-rose-900/60 text-rose-300 border border-rose-800/50 text-xs font-bold transition-all"
                  title="Cancel scan"
                >
                  <Square className="w-3 h-3 fill-current" />
                  <span>Stop</span>
                </button>
              </div>
            ) : scanState?.isPaused ? (
              <div className="flex items-center gap-2">
                <button
                  onClick={handleResumeScan}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-bold transition-all shadow-md active:scale-95"
                >
                  <Play className="w-3.5 h-3.5 fill-current" />
                  <span>Resume Scan</span>
                </button>
                <button
                  onClick={handleResetScan}
                  className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium border border-slate-700"
                  title="Reset queue position"
                >
                  <RotateCcw className="w-3 h-3" />
                  <span>Reset</span>
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleStartSystematicScan(true)}
                  disabled={batchRunning}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white text-xs font-bold transition-all shadow-lg shadow-cyan-950/40 active:scale-95 border border-cyan-400/30"
                >
                  <ListOrdered className="w-4 h-4 text-cyan-200" />
                  <span>Start Full Monthly Scan (All Pending)</span>
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Systematic Queue Status Banner */}
        <div className="rounded-xl border p-4 transition-all duration-300 bg-slate-950/70 border-slate-800">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                {scanState?.isScanning ? (
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 animate-pulse">
                    <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
                    SYSTEMATIC SCAN IN PROGRESS
                  </span>
                ) : scanState?.isPaused ? (
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                    <Pause className="w-2.5 h-2.5 fill-current" />
                    SCAN PAUSED
                  </span>
                ) : scanState?.isCompleted ? (
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                    <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                    100% OF PENDING PREDICTIONS PROCESSED
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-slate-800 text-slate-300 border border-slate-700">
                    <ShieldCheck className="w-3 h-3 text-cyan-400" />
                    SYSTEMATIC QUEUE READY
                  </span>
                )}
                <span className="text-xs text-slate-400">
                  {predictions.filter(p => p.status === 'Pending').length} pending predictions in registry
                </span>
              </div>
              <p className="text-xs text-slate-300">
                {scanState?.isScanning 
                  ? `Iterating without exceptions: verifying ${scanState.currentPredictionCode || 'item'} (${scanState.currentModel || 'Model'}) with live search.`
                  : scanState?.isPaused
                  ? `Queue paused at item #${scanState.currentIndex} of ${scanState.totalItems}. Click Resume to continue systematic verification.`
                  : scanState?.isCompleted
                  ? `All ${scanState.processedCount} pending predictions were evaluated. Verdicts are ready for human approval below.`
                  : 'Sequentially checks every Pending prediction across Grok (#BR-GROK-01...), Claude, ChatGPT, Gemini, and Perplexity without skipping.'}
              </p>
            </div>

            {/* Quick Filter & Custom Launch Options */}
            <div className="flex flex-wrap items-center gap-3">
              <div className="flex items-center gap-1.5 text-xs">
                <span className="text-slate-400">Scope:</span>
                <select
                  value={targetScope}
                  onChange={e => setTargetScope(e.target.value as any)}
                  className="bg-slate-900 border border-slate-700 text-slate-200 rounded-lg px-2.5 py-1 text-xs focus:outline-none focus:border-cyan-500"
                >
                  <option value="All">All Scopes</option>
                  <option value="Brazil">Brazil</option>
                  <option value="Global">Global</option>
                  <option value="Geopolitics">Geopolitics</option>
                </select>
              </div>

              <div className="flex items-center gap-1.5 text-xs">
                <span className="text-slate-400">Model:</span>
                <select
                  value={targetModel}
                  onChange={e => setTargetModel(e.target.value as any)}
                  className="bg-slate-900 border border-slate-700 text-slate-200 rounded-lg px-2.5 py-1 text-xs focus:outline-none focus:border-cyan-500"
                >
                  <option value="All">All Models (Grok, Claude, ChatGPT, Gemini, Perplexity)</option>
                  <option value="Grok">Grok (#BR-GROK-01...)</option>
                  <option value="Claude">Claude (#BR-CL-01...)</option>
                  <option value="ChatGPT">ChatGPT (#BR-GPT-01...)</option>
                  <option value="Gemini">Gemini (#BR-GEM-01...)</option>
                  <option value="Perplexity">Perplexity (#BR-PPLX-01...)</option>
                </select>
              </div>

              {!scanState?.isScanning && !scanState?.isPaused && (
                <button
                  onClick={() => handleStartSystematicScan(false)}
                  disabled={batchRunning}
                  className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-300 border border-slate-700 transition-colors"
                  title="Run filtered batch"
                >
                  <Play className="w-3 h-3 fill-current text-cyan-400" />
                  <span>Scan Filtered ({unverifiedCountForSelected})</span>
                </button>
              )}
            </div>
          </div>

          {/* Real-time Progress Bar & Live Target Card */}
          {(scanState?.isScanning || scanState?.isPaused || batchRunning) && (
            <div className="mt-4 pt-4 border-t border-slate-800/80 space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between text-xs gap-1.5">
                <span className="font-semibold text-cyan-300 flex items-center gap-2">
                  <Sparkles className="w-3.5 h-3.5 text-cyan-400 animate-spin" />
                  <span>
                    Evaluating: <strong className="font-mono text-white text-sm">#{scanState?.currentPredictionCode || progressInfo?.currentPrediction || 'Analyzing'}</strong>
                    {scanState?.currentModel && (
                      <span className="ml-2 px-2 py-0.5 rounded text-[10px] font-bold bg-slate-800 text-slate-300 border border-slate-700">
                        {scanState.currentModel}
                      </span>
                    )}
                  </span>
                </span>
                <span className="text-cyan-400 font-mono font-bold">
                  {scanState?.currentIndex || progressInfo?.current || 0} / {scanState?.totalItems || progressInfo?.total || 0} Pending Items (
                  {Math.round(((scanState?.currentIndex || progressInfo?.current || 0) / (scanState?.totalItems || progressInfo?.total || 1)) * 100)}%)
                </span>
              </div>

              {scanState?.currentTitle && (
                <p className="text-xs text-slate-300 italic truncate max-w-3xl">
                  &ldquo;{scanState.currentTitle}&rdquo;
                </p>
              )}

              <div className="w-full bg-slate-900 h-2.5 rounded-full overflow-hidden border border-slate-800">
                <div 
                  className={`h-full transition-all duration-300 ${scanState?.isPaused ? 'bg-amber-500' : 'bg-gradient-to-r from-cyan-500 to-emerald-500'}`}
                  style={{ 
                    width: `${Math.min(100, Math.max(2, ((scanState?.currentIndex || progressInfo?.current || 0) / (scanState?.totalItems || progressInfo?.total || 1)) * 100))}%` 
                  }}
                />
              </div>

              {/* Live Run Counters */}
              <div className="flex flex-wrap items-center gap-4 text-xs font-mono pt-1 text-slate-400">
                <span>Processed: <strong className="text-white">{scanState?.processedCount || 0}</strong></span>
                <span>Confirmed: <strong className="text-emerald-400">{scanState?.confirmedCount || 0}</strong></span>
                <span>Debunked: <strong className="text-rose-400">{scanState?.debunkedCount || 0}</strong></span>
                <span>Pending: <strong className="text-amber-400">{scanState?.pendingCount || 0}</strong></span>
                {scanState?.failedCount ? (
                  <span>Errors: <strong className="text-red-400">{scanState.failedCount}</strong></span>
                ) : null}
              </div>
            </div>
          )}

          {/* Live Activity Terminal / Event Log Toggle */}
          {scanState?.recentLogs && scanState.recentLogs.length > 0 && (
            <div className="mt-4 pt-3 border-t border-slate-800/80">
              <div className="flex items-center justify-between mb-2">
                <button
                  onClick={() => setShowLogs(!showLogs)}
                  className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-cyan-400 font-semibold transition-colors"
                >
                  <Terminal className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Live Queue Verification Stream ({scanState.recentLogs.length} events)</span>
                  {showLogs ? <ChevronUp className="w-3 h-3 ml-1" /> : <ChevronDown className="w-3 h-3 ml-1" />}
                </button>
                <span className="text-[10px] text-slate-500 font-mono">
                  All models checked without skipping
                </span>
              </div>

              {showLogs && (
                <div className="bg-slate-950/90 rounded-lg p-3 border border-slate-800 max-h-44 overflow-y-auto space-y-1.5 font-mono text-[11px]">
                  {scanState.recentLogs.slice(0, 15).map((log, idx) => (
                    <div key={idx} className="flex items-center justify-between gap-3 text-slate-300">
                      <div className="flex items-center gap-2 truncate">
                        <span className="text-slate-500 text-[10px] shrink-0">{log.timestamp}</span>
                        <span className="font-bold text-white shrink-0">[{log.predictionCode}]</span>
                        <span className="px-1.5 py-0.2 rounded text-[10px] bg-slate-800 text-slate-300 shrink-0">
                          {log.model}
                        </span>
                        <span className="truncate text-slate-300">{log.message}</span>
                      </div>
                      <span className={`text-[10px] px-2 py-0.5 rounded font-bold shrink-0 ${
                        log.status === 'Confirmed' 
                          ? 'bg-emerald-950 text-emerald-400 border border-emerald-800/50' 
                          : log.status === 'Debunked'
                          ? 'bg-rose-950 text-rose-400 border border-rose-800/50'
                          : 'bg-amber-950 text-amber-400 border border-amber-800/50'
                      }`}>
                        {log.status}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>


      {/* Sub-Navigation Tabs */}
      <div className="flex border-b border-slate-800 gap-2">
        <button
          onClick={() => setActiveTab('queue')}
          className={`pb-3 px-3 text-xs font-semibold flex items-center gap-2 border-b-2 transition-colors ${
            activeTab === 'queue'
              ? 'border-cyan-500 text-cyan-400'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <span>Review Queue</span>
          <span className={`px-2 py-0.5 rounded-full text-[10px] tabular-nums font-bold ${pendingQueue.length > 0 ? 'bg-cyan-500/20 text-cyan-300' : 'bg-slate-800 text-slate-500'}`}>
            {pendingQueue.length}
          </span>
        </button>

        <button
          onClick={() => setActiveTab('approved')}
          className={`pb-3 px-3 text-xs font-semibold flex items-center gap-2 border-b-2 transition-colors ${
            activeTab === 'approved'
              ? 'border-cyan-500 text-cyan-400'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <span>Approved Dossiers</span>
          <span className="px-2 py-0.5 rounded-full text-[10px] tabular-nums font-bold bg-slate-800 text-slate-400">
            {approvedQueue.length}
          </span>
        </button>

        <button
          onClick={() => setActiveTab('single')}
          className={`pb-3 px-3 text-xs font-semibold flex items-center gap-2 border-b-2 transition-colors ${
            activeTab === 'single'
              ? 'border-cyan-500 text-cyan-400'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <Search className="w-3.5 h-3.5" />
          <span>Quick URL / Prediction Check</span>
        </button>

        <button
          onClick={() => setActiveTab('history')}
          className={`pb-3 px-3 text-xs font-semibold flex items-center gap-2 border-b-2 transition-colors ${
            activeTab === 'history'
              ? 'border-cyan-500 text-cyan-400'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <History className="w-3.5 h-3.5" />
          <span>Run History Logs</span>
        </button>
      </div>

      {/* TAB 1: REVIEW QUEUE */}
      {activeTab === 'queue' && (
        <div className="space-y-6">
          {filteredQueue.length === 0 ? (
            <div className="bg-slate-900/40 border border-slate-800 rounded-2xl p-12 text-center max-w-xl mx-auto space-y-4">
              <div className="w-12 h-12 rounded-full bg-emerald-950/40 text-emerald-400 border border-emerald-800/50 flex items-center justify-center mx-auto">
                <Check className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-white">No Pending Items for Current Filter</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Click &quot;Verify Next Batch&quot; above to systematically scan unverified predictions (including Grok, ChatGPT, Claude, etc.), or paste a custom URL into any prediction to verify it.
              </p>
              <div className="pt-2">
                <button
                  onClick={handleTriggerSystematicBatch}
                  disabled={batchRunning}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-semibold"
                >
                  <Play className="w-3.5 h-3.5 fill-current" />
                  <span>Verify Next Batch Now</span>
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              {filteredQueue.map(dossier => {
                const modelCfg = MODEL_CONFIG[dossier.model] || { color: 'text-slate-300', bg: 'bg-slate-800' };
                const isItemAction = actionInProgress === dossier.id;
                const isUrlActive = expandedUrlInput === dossier.id;
                const isAnalyzing = urlAnalyzingId === dossier.predictionId;
                const isSearchActive = expandedSearchInput === dossier.id;
                const isSearchAnalyzing = searchAnalyzingId === dossier.predictionId;

                // Match original prediction description for full reasoning display
                const origPred = predictions.find(p => p.id === dossier.predictionId);

                return (
                  <div 
                    key={dossier.id}
                    className="bg-[#0f172a] border border-slate-800 rounded-2xl p-6 shadow-xl space-y-6 relative overflow-hidden transition-all hover:border-slate-700"
                  >
                    {/* Top Bar */}
                    <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800/80 pb-4">
                      <div className="flex items-center gap-3">
                        <span className={`px-2.5 py-1 rounded-md text-[10px] font-black uppercase tracking-wider ${modelCfg.bg} ${modelCfg.color}`}>
                          {dossier.model}
                        </span>
                        <span className="text-cyan-400 font-mono text-xs font-bold">
                          #{dossier.predictionCode}
                        </span>
                        <span className="text-slate-600 text-xs">·</span>
                        <span className="text-xs text-slate-400 font-medium">
                          {dossier.scope} / {dossier.category}
                        </span>
                      </div>

                      <div className="flex items-center gap-2 text-xs">
                        <button
                          onClick={() => {
                            setExpandedSearchInput(isSearchActive ? null : dossier.id);
                            setCardCustomSearchTerms('');
                            setExpandedUrlInput(null);
                          }}
                          className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-cyan-300 border border-slate-700 text-xs transition-colors"
                        >
                          <Search className="w-3 h-3" />
                          <span>Search Terms</span>
                          {isSearchActive ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                        </button>

                        <button
                          onClick={() => {
                            setExpandedUrlInput(isUrlActive ? null : dossier.id);
                            setCardCustomUrl('');
                            setExpandedSearchInput(null);
                          }}
                          className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-cyan-300 border border-slate-700 text-xs transition-colors"
                        >
                          <Link className="w-3 h-3" />
                          <span>Suggest URL</span>
                          {isUrlActive ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                        </button>

                        <div className="flex items-center gap-1.5 text-slate-500 font-mono">
                          <Clock className="w-3.5 h-3.5" />
                          <span>{new Date(dossier.evaluatedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
                        </div>
                      </div>
                    </div>

                    {/* Expandable Custom Search Terms Input */}
                    {isSearchActive && (
                      <div className="p-4 rounded-xl bg-cyan-950/20 border border-cyan-800/30 space-y-3 animate-in fade-in">
                        <div className="flex items-center justify-between text-xs text-cyan-300 font-semibold">
                          <span>Search Live News with Specific Terms for #{dossier.predictionCode}</span>
                          <span className="text-slate-400 font-normal">Runs term-based search against current 2026 news</span>
                        </div>
                        <div className="flex gap-2">
                          <input
                            type="text"
                            value={cardCustomSearchTerms}
                            onChange={e => setCardCustomSearchTerms(e.target.value)}
                            placeholder="e.g. eleicoes 2026 brasil segundo turno lula tarcisio resultado"
                            className="flex-grow bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-cyan-500 font-medium"
                          />
                          <button
                            onClick={() => handleVerifyWithCustomTerms(dossier.predictionId, cardCustomSearchTerms)}
                            disabled={!cardCustomSearchTerms.trim() || isSearchAnalyzing}
                            className="px-4 py-2 bg-cyan-600 hover:bg-cyan-500 disabled:bg-slate-800 text-white rounded-lg text-xs font-bold transition-colors inline-flex items-center gap-1.5 shrink-0"
                          >
                            {isSearchAnalyzing ? (
                              <>
                                <RefreshCw className="w-3 h-3 animate-spin" />
                                <span>Searching News...</span>
                              </>
                            ) : (
                              <>
                                <Search className="w-3 h-3" />
                                <span>Search & Verify</span>
                              </>
                            )}
                          </button>
                        </div>
                      </div>
                    )}

                    {/* Expandable Custom URL Input */}
                    {isUrlActive && (
                      <div className="p-4 rounded-xl bg-cyan-950/20 border border-cyan-800/30 space-y-3 animate-in fade-in">
                        <div className="flex items-center justify-between text-xs text-cyan-300 font-semibold">
                          <span>Inform Verification URL for #{dossier.predictionCode}</span>
                          <span className="text-slate-400 font-normal">Gemini will analyze this article directly</span>
                        </div>
                        <div className="flex gap-2">
                          <input
                            type="url"
                            value={cardCustomUrl}
                            onChange={e => setCardCustomUrl(e.target.value)}
                            placeholder="https://g1.globo.com/... or https://reuters.com/..."
                            className="flex-grow bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-cyan-500 font-mono"
                          />
                          <button
                            onClick={() => handleVerifyWithCustomUrl(dossier.predictionId, cardCustomUrl)}
                            disabled={!cardCustomUrl.trim() || isAnalyzing}
                            className="px-4 py-2 bg-cyan-600 hover:bg-cyan-500 disabled:bg-slate-800 text-white rounded-lg text-xs font-bold transition-colors inline-flex items-center gap-1.5 shrink-0"
                          >
                            {isAnalyzing ? (
                              <>
                                <RefreshCw className="w-3 h-3 animate-spin" />
                                <span>Analyzing Article...</span>
                              </>
                            ) : (
                              <>
                                <Send className="w-3 h-3" />
                                <span>Fact-Check This URL</span>
                              </>
                            )}
                          </button>
                        </div>
                      </div>
                    )}

                    {/* Content Columns: Prediction vs AI Suggested Verdict */}
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                      {/* Left: Original Claim & Reasoning */}
                      <div className="lg:col-span-6 space-y-4">
                        <div>
                          <span className="text-[10px] font-black uppercase tracking-wider text-slate-500 block mb-1">Prediction Title</span>
                          <h4 className="text-base font-bold text-white leading-snug">
                            {dossier.predictionTitle}
                          </h4>
                        </div>

                        {origPred && (
                          <div className="bg-slate-950/60 p-4 rounded-xl border border-slate-800/70 text-xs text-slate-300 leading-relaxed space-y-1.5">
                            <span className="text-[10px] font-black uppercase tracking-wider text-cyan-400 block">Original Reasoning & Criteria</span>
                            <p className="line-clamp-4 hover:line-clamp-none transition-all">{origPred.description}</p>
                          </div>
                        )}
                      </div>

                      {/* Right: AI Verification Dossier */}
                      <div className="lg:col-span-6 space-y-4 lg:border-l lg:border-slate-800/80 lg:pl-6">
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] font-black uppercase tracking-wider text-slate-500">Evaluated Outcome</span>
                          <div className="flex items-center gap-3">
                            <span className="text-xs text-slate-400">Confidence: <strong className="text-cyan-400 font-mono tabular-nums">{dossier.confidence}%</strong></span>
                            <span className={`px-3 py-1 rounded-full text-xs font-bold border ${
                              dossier.suggestedStatus === 'Confirmed' 
                                ? 'bg-emerald-950/60 text-emerald-400 border-emerald-800/50' 
                                : dossier.suggestedStatus === 'Debunked'
                                ? 'bg-rose-950/60 text-rose-400 border-rose-800/50'
                                : 'bg-slate-800 text-slate-300 border-slate-700'
                            }`}>
                              {dossier.suggestedStatus}
                            </span>
                          </div>
                        </div>

                        {/* Reasoning */}
                        <div className="bg-slate-950/80 p-4 rounded-xl border border-slate-800/80 text-xs text-slate-300 leading-relaxed">
                          <p className="font-semibold text-slate-200 mb-1 flex items-center gap-1.5 text-cyan-400">
                            <Sparkles className="w-3.5 h-3.5" />
                            <span>Grounded Verification Synthesis</span>
                          </p>
                          {dossier.reasoning}
                        </div>

                        {/* Cited Sources */}
                        {dossier.evidence && dossier.evidence.length > 0 && (
                          <div className="space-y-2">
                            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Sources Examined</span>
                            <div className="space-y-1.5">
                              {dossier.evidence.map((ev, i) => (
                                <a
                                  key={i}
                                  href={ev.sourceUrl}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="flex items-center justify-between gap-2 p-2 rounded-lg bg-slate-950/50 hover:bg-slate-800/50 border border-slate-800/50 text-xs text-slate-300 transition-colors group"
                                >
                                  <div className="truncate">
                                    <span className="font-medium text-slate-200 group-hover:text-cyan-400 truncate block">
                                      {ev.sourceTitle || ev.sourceUrl}
                                    </span>
                                    {ev.snippet && (
                                      <p className="text-[11px] text-slate-500 truncate mt-0.5">{ev.snippet}</p>
                                    )}
                                  </div>
                                  <ExternalLink className="w-3.5 h-3.5 text-slate-500 shrink-0 group-hover:text-cyan-400" />
                                </a>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Human in the loop action footer */}
                    <div className="border-t border-slate-800/80 pt-4 flex flex-wrap items-center justify-between gap-3 bg-slate-950/30 -mx-6 -mb-6 px-6 py-4 rounded-b-2xl">
                      <div className="flex items-center gap-2 text-xs text-slate-400">
                        <AlertTriangle className="w-3.5 h-3.5 text-amber-500" />
                        <span>Requires human review to publish to live leaderboard</span>
                      </div>

                      <div className="flex items-center gap-2">
                        {/* Dismiss */}
                        <button
                          onClick={() => handleApplyReview(dossier.id, 'reject')}
                          disabled={isItemAction}
                          className="px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition-colors"
                        >
                          Dismiss
                        </button>

                        {/* Keep Pending */}
                        <button
                          onClick={() => handleApplyReview(dossier.id, 'keep_pending')}
                          disabled={isItemAction}
                          className="px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-300 bg-slate-800 hover:bg-slate-700 transition-colors"
                        >
                          Keep Pending
                        </button>

                        {/* Modify & Approve */}
                        <button
                          onClick={() => {
                            setEditingDossier(dossier);
                            setModifiedStatus(dossier.suggestedStatus);
                            setAdminNotes(dossier.reasoning);
                          }}
                          disabled={isItemAction}
                          className="px-3 py-1.5 rounded-lg text-xs font-semibold text-cyan-300 bg-cyan-950/60 hover:bg-cyan-900/60 border border-cyan-800/50 transition-colors inline-flex items-center gap-1.5"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                          <span>Modify & Approve</span>
                        </button>

                        {/* 1-Click Approve Verdict */}
                        <button
                          onClick={() => handleApplyReview(dossier.id, 'approve')}
                          disabled={isItemAction}
                          className="px-4 py-1.5 rounded-lg text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-500 transition-colors shadow-sm inline-flex items-center gap-1.5 active:scale-95"
                        >
                          <Check className="w-3.5 h-3.5" />
                          <span>Approve {dossier.suggestedStatus}</span>
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* TAB 2: APPROVED DOSSIERS */}
      {activeTab === 'approved' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Verified predictions with human sign-off</span>
            <span>Total: {approvedQueue.length}</span>
          </div>

          {approvedQueue.length === 0 ? (
            <div className="bg-slate-900/40 border border-slate-800 rounded-2xl p-12 text-center text-slate-400 text-xs">
              No approved dossiers yet. Review items in the queue to publish verified predictions.
            </div>
          ) : (
            <div className="divide-y divide-slate-800 bg-slate-900/60 border border-slate-800 rounded-2xl overflow-hidden">
              {approvedQueue.map(dossier => (
                <div key={dossier.id} className="p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-bold text-cyan-400">#{dossier.predictionCode}</span>
                      <span className="text-slate-600 text-xs">·</span>
                      <span className="text-xs text-slate-400">{dossier.model} ({dossier.scope})</span>
                    </div>
                    <h5 className="text-sm font-semibold text-white">{dossier.predictionTitle}</h5>
                    {dossier.adminNotes && (
                      <p className="text-xs text-slate-400">{dossier.adminNotes}</p>
                    )}
                  </div>

                  <div className="flex items-center gap-4 shrink-0">
                    <div className="text-right">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-bold border ${
                        dossier.suggestedStatus === 'Confirmed' 
                          ? 'bg-emerald-950/50 text-emerald-400 border-emerald-800/40' 
                          : 'bg-rose-950/50 text-rose-400 border-rose-800/40'
                      }`}>
                        {dossier.suggestedStatus}
                      </span>
                      <div className="text-[10px] text-slate-500 mt-1 font-mono">
                        {dossier.reviewedAt ? new Date(dossier.reviewedAt).toLocaleDateString() : ''}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* TAB 3: QUICK URL & SINGLE CHECK */}
      {activeTab === 'single' && (
        <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 md:p-8 space-y-6">
          <div className="max-w-2xl">
            <h3 className="text-lg font-bold text-white">Targeted Fact-Check & Custom URL Verifier</h3>
            <p className="text-xs text-slate-400 mt-1">
              Select any specific prediction (e.g. Grok, Claude, etc.) and optionally paste a news article URL. Gemini will evaluate the Title and Reasoning against the evidence.
            </p>
          </div>

          <form onSubmit={handleVerifySingle} className="space-y-4 max-w-2xl">
            <div>
              <label className="text-xs font-bold text-slate-400 block mb-1.5">Select Prediction</label>
              <select
                value={singlePredId}
                onChange={e => setSinglePredId(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-2.5 text-xs text-slate-200 focus:outline-none focus:border-cyan-500 font-medium"
              >
                <option value="">Select a prediction...</option>
                {predictions.map(p => (
                  <option key={p.id} value={p.id}>
                    [{p.code}] {p.title.slice(0, 65)}... ({p.model} - {p.status})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-400 block mb-1.5 flex items-center justify-between">
                <span>Informed Source URL (Optional)</span>
                <span className="text-[10px] text-slate-500 font-normal">Leave blank for web search</span>
              </label>
              <input
                type="url"
                value={singleCustomUrl}
                onChange={e => setSingleCustomUrl(e.target.value)}
                placeholder="https://example.com/news-article..."
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-2.5 text-xs text-slate-200 focus:outline-none focus:border-cyan-500 font-mono"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-400 block mb-1.5 flex items-center justify-between">
                <span>Search Query Terms (Optional)</span>
                <span className="text-[10px] text-slate-500 font-normal">Custom search keywords to search real 2026 news</span>
              </label>
              <input
                type="text"
                value={singleCustomSearchTerms}
                onChange={e => setSingleCustomSearchTerms(e.target.value)}
                placeholder="e.g. eleicoes 2026 brasil segundo turno lula tarcisio resultado oficial"
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-2.5 text-xs text-slate-200 focus:outline-none focus:border-cyan-500 font-medium"
              />
            </div>

            <button
              type="submit"
              disabled={!singlePredId || singleLoading}
              className="px-5 py-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 disabled:bg-slate-800 disabled:text-slate-600 text-white text-xs font-bold transition-colors inline-flex items-center gap-2"
            >
              {singleLoading ? (
                <>
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                  <span>Evaluating Prediction...</span>
                </>
              ) : (
                <>
                  <Search className="w-3.5 h-3.5" />
                  <span>Verify with {singleCustomUrl.trim() ? 'Informed URL' : 'Live Search'}</span>
                </>
              )}
            </button>
          </form>

          {singleError && (
            <div className="p-4 rounded-xl bg-rose-950/40 border border-rose-800/50 text-rose-300 text-xs">
              {singleError}
            </div>
          )}

          {singleResult && (
            <div className="p-6 rounded-xl bg-slate-950 border border-slate-800 space-y-4 max-w-3xl animate-in fade-in">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-cyan-400">Outcome for #{singleResult.predictionCode}</span>
                <span className={`px-3 py-1 rounded-full text-xs font-bold border ${
                  singleResult.suggestedStatus === 'Confirmed'
                    ? 'bg-emerald-950 text-emerald-400 border-emerald-800'
                    : singleResult.suggestedStatus === 'Debunked'
                    ? 'bg-rose-950 text-rose-400 border-rose-800'
                    : 'bg-slate-800 text-slate-300 border-slate-700'
                }`}>
                  Verdict: {singleResult.suggestedStatus}
                </span>
              </div>

              <div className="text-xs text-slate-300 leading-relaxed bg-white/5 p-4 rounded-lg">
                <strong className="text-slate-200 block mb-1">Reasoning:</strong>
                {singleResult.reasoning}
              </div>

              {singleResult.evidence.length > 0 && (
                <div className="space-y-1.5">
                  <span className="text-[10px] uppercase font-bold text-slate-500">Grounded Sources:</span>
                  {singleResult.evidence.map((ev, idx) => (
                    <a
                      key={idx}
                      href={ev.sourceUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block p-2 rounded bg-slate-900 border border-slate-800 text-xs text-cyan-400 hover:underline truncate"
                    >
                      {ev.sourceTitle || ev.sourceUrl}
                    </a>
                  ))}
                </div>
              )}

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  onClick={() => handleApplyReview(singleResult.id, 'approve')}
                  className="px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold"
                >
                  Approve and Publish Verdict
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* TAB 4: RUN LOGS */}
      {activeTab === 'history' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Automated & manual monthly verification logs</span>
            <span>Total runs recorded: {runs.length}</span>
          </div>

          {runs.length === 0 ? (
            <div className="bg-slate-900/40 border border-slate-800 rounded-2xl p-12 text-center text-slate-400 text-xs">
              No runs recorded yet.
            </div>
          ) : (
            <div className="divide-y divide-slate-800 bg-slate-900/60 border border-slate-800 rounded-2xl overflow-hidden">
              {runs.map(r => (
                <div key={r.id} className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-3.5 h-3.5 text-cyan-400" />
                      <span className="text-xs font-bold text-white">{r.month}</span>
                      <span className="text-slate-600">·</span>
                      <span className={`text-[10px] uppercase font-bold ${
                        r.status === 'completed' ? 'text-emerald-400' : r.status === 'running' ? 'text-amber-400' : 'text-rose-400'
                      }`}>
                        {r.status}
                      </span>
                    </div>
                    <span className="text-[11px] text-slate-500 font-mono">
                      Timestamp: {new Date(r.timestamp).toLocaleString()}
                    </span>
                  </div>

                  <div className="flex items-center gap-4 text-xs font-mono">
                    <div className="text-right">
                      <span className="text-slate-400 block text-[10px] uppercase">Checked</span>
                      <strong className="text-slate-200">{r.totalChecked} items</strong>
                    </div>
                    <div className="text-right">
                      <span className="text-slate-400 block text-[10px] uppercase">Confirmed</span>
                      <strong className="text-emerald-400">{r.suggestedConfirmed}</strong>
                    </div>
                    <div className="text-right">
                      <span className="text-slate-400 block text-[10px] uppercase">Debunked</span>
                      <strong className="text-rose-400">{r.suggestedDebunked}</strong>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Modify & Approve Modal */}
      {editingDossier && (
        <div className="fixed inset-0 z-[130] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm" onClick={() => setEditingDossier(null)} />
          <div className="relative bg-slate-900 border border-slate-800 rounded-2xl p-6 md:p-8 max-w-xl w-full space-y-6 shadow-2xl">
            <div>
              <span className="text-xs font-mono font-bold text-cyan-400">#{editingDossier.predictionCode}</span>
              <h3 className="text-lg font-bold text-white mt-1">{editingDossier.predictionTitle}</h3>
            </div>

            <div className="space-y-4">
              <div>
                <label className="text-xs font-bold text-slate-400 block mb-2">Set Human-Approved Status</label>
                <div className="grid grid-cols-3 gap-2">
                  {(['Confirmed', 'Debunked', 'Pending'] as const).map(s => (
                    <button
                      key={s}
                      type="button"
                      onClick={() => setModifiedStatus(s)}
                      className={`py-2 px-3 rounded-xl text-xs font-bold border transition-colors ${
                        modifiedStatus === s
                          ? s === 'Confirmed'
                            ? 'bg-emerald-600 text-white border-emerald-500'
                            : s === 'Debunked'
                            ? 'bg-rose-600 text-white border-rose-500'
                            : 'bg-slate-700 text-white border-slate-600'
                          : 'bg-slate-950 text-slate-400 border-slate-800 hover:bg-slate-800'
                      }`}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-400 block mb-2">Verification Notes & Public Rationale</label>
                <textarea
                  rows={4}
                  value={adminNotes}
                  onChange={e => setAdminNotes(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-slate-200 focus:outline-none focus:border-cyan-500"
                  placeholder="Explain why this status was verified or modified..."
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setEditingDossier(null)}
                className="px-4 py-2 rounded-xl text-xs text-slate-400 hover:text-white"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => handleApplyReview(editingDossier.id, 'modify', modifiedStatus, adminNotes)}
                className="px-5 py-2 rounded-xl text-xs font-bold bg-cyan-600 hover:bg-cyan-500 text-white shadow-md"
              >
                Save & Publish Status
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
