import React, { useState } from 'react';
import { 
  Brain, 
  Target, 
  ShieldCheck, 
  Microscope, 
  Terminal, 
  Layers, 
  Wallet, 
  Coffee, 
  Copy, 
  Check,
  Zap,
  Coins,
  ExternalLink,
  Link2,
  Sparkles,
  Search,
  User
} from 'lucide-react';

export const Methodology: React.FC = () => {
  const [copied, setCopied] = useState<string | null>(null);

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopied(id);
    setTimeout(() => setCopied(null), 2000);
  };

  const sections = [
    {
      icon: <Target className="w-6 h-6 text-blue-500" />,
      title: "Project Mission",
      content: "Launched on January 3rd, 2026, the Oracle project benchmarks 'Synthetic Intuition'. We analyze how LLMs synthesize emerging signals to project outcomes in high-volatility environments."
    },
    {
      icon: <User className="w-6 h-6 text-indigo-400" />,
      title: "Project Lead",
      content: (
        <span>
          Developed and researched by <a href="https://patricksilveira.com.br/" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:text-blue-300 underline decoration-blue-500/30 underline-offset-4 font-bold">Patrick Silveira</a>. Connect on <a href="https://www.linkedin.com/in/patricksilveira/" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:text-blue-300 underline decoration-blue-500/30 underline-offset-4 font-bold">LinkedIn</a>.
        </span>
      )
    },
    {
      icon: <Search className="w-6 h-6 text-emerald-400" />,
      title: "Automated Verification",
      content: "Future updates will include a 'Fact-Checking Agent' leveraging Google Search Grounding via Gemini API to automatically scan global news for evidence of prediction outcomes."
    },
    {
      icon: <Link2 className="w-6 h-6 text-orange-400" />,
      title: "API Infrastructure",
      content: (
        <span>
          All models were queried through <a href="https://go.adapta.org/campaign/ref-central?utm_content=wNAK2UtMW1wV" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:text-blue-300 underline decoration-blue-500/30 underline-offset-4 font-bold">Adapta's API Platform</a>. This ensures standardized latency and access to frontier model weights.
        </span>
      )
    },
    {
      icon: <ShieldCheck className="w-6 h-6 text-cyan-500" />,
      title: "Status Definitions",
      content: "PENDING: Event window remains open. CONFIRMED: Substantial evidence proves the event. DEBUNKED: A contradictory event occurred. ONGOING: Event process has started."
    },
    {
      icon: <Microscope className="w-6 h-6 text-rose-500" />,
      title: "Calibration tracking",
      content: "We track 'Calibration'—how often their 90% confidence predictions actually come true versus their 50% ones. This measures true model self-awareness."
    }
  ];

  const donationAddresses = [
    { label: 'Bitcoin (BTC)', address: 'bc1q66jdsspjnevz89a27g04grt45rwspd0zra86ta', id: 'btc', icon: <Zap className="w-4 h-4 text-orange-400" /> },
    { label: 'Lightning Network', address: 'snidedancer61@walletofsatoshi.com', id: 'ln', icon: <Zap className="w-4 h-4 text-yellow-400" /> },
    { label: 'Solana (SOL)', address: 'HgtEbw4a5VnZonm2yKWzvzVcZrM9vxUNximkZbpoP5kt', id: 'sol', icon: <Coins className="w-4 h-4 text-emerald-400" /> },
    { label: 'Ethereum (ETH)', address: '0x4c2879669011dC14595dAE93952599aDd5b772b1', id: 'eth', icon: <Coins className="w-4 h-4 text-indigo-400" /> },
  ];

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-700 space-y-12">
      {/* Main Content */}
      <div className="glass rounded-3xl p-8 md:p-12 border-white/5 relative overflow-hidden">
        <div className="absolute top-0 right-0 p-8 opacity-10">
          <Brain className="w-40 h-40" />
        </div>
        
        <div className="max-w-3xl">
          <h2 className="text-3xl font-black mb-6 tracking-tight text-white uppercase italic">Experimental Framework 2026</h2>
          <p className="text-slate-400 text-lg leading-relaxed mb-12">
            The ORACLE 2026 experiment captures the predictive edge of LLMs at the dawn of the year. 
            By recording bold, intuitive predictions on January 3rd, we create an immutable record of AI foresight.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {sections.map((section, idx) => (
              <div key={idx} className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-xl bg-white/5 border border-white/10">
                    {section.icon}
                  </div>
                  <h3 className="font-bold text-slate-200 uppercase tracking-widest text-xs">
                    {section.title}
                  </h3>
                </div>
                <div className="text-sm text-slate-500 leading-relaxed font-medium">
                  {section.content}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-16 flex flex-col md:flex-row gap-8">
          <div className="flex-1 p-6 rounded-2xl bg-blue-600/10 border border-blue-500/20">
            <h4 className="text-xs font-black text-blue-400 uppercase tracking-[0.2em] mb-4">Prompt Verification</h4>
            <div className="space-y-2 text-sm text-blue-100/70 italic font-mono bg-black/20 p-4 rounded-xl">
              <p>1. "Do your new year's predictions for 2026 Analyse the scenario in Brazil and make 12 or more predictions for Brazil..."</p>
              <p>2. "Now Global Predictions"</p>
              <p>3. "Now Geopolitical Predictions"</p>
            </div>
          </div>
          
          <div className="flex-1 p-6 rounded-2xl bg-orange-500/10 border border-orange-500/20 flex flex-col justify-center">
            <h4 className="text-xs font-black text-orange-400 uppercase tracking-[0.2em] mb-2">Powered by Adapta</h4>
            <p className="text-sm text-slate-400 mb-4">LLMs powered by the Adapta Platform. Infrastructure for the next generation of synthetic intuition.</p>
            <a 
              href="https://go.adapta.org/campaign/ref-central?utm_content=wNAK2UtMW1wV" 
              target="_blank" 
              rel="noopener noreferrer"
              className="w-fit flex items-center gap-2 px-4 py-2 bg-orange-500 text-white rounded-xl text-xs font-black uppercase tracking-widest hover:bg-orange-400 transition-all shadow-lg shadow-orange-500/20"
            >
              Explore Adapta Platform
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>
      </div>

      {/* Donation Section */}
      <div className="glass rounded-3xl p-8 md:p-12 border-white/5 bg-gradient-to-br from-slate-900/50 to-blue-900/20">
        <div className="flex flex-col md:flex-row gap-12 items-center">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-3 rounded-2xl bg-blue-500/20 border border-blue-500/30">
                <Coffee className="w-6 h-6 text-blue-400" />
              </div>
              <h2 className="text-2xl font-black text-white uppercase tracking-tighter">Support the Oracle</h2>
            </div>
            <p className="text-slate-400 leading-relaxed mb-6">
              This is an independent project. To keep the Oracle running, we rely on community support to cover 
              <strong> hosting fees</strong> and the significant token costs associated with querying 
              top-tier reasoning models.
            </p>
            <div className="flex items-center gap-2 text-xs font-bold text-slate-500 uppercase tracking-widest bg-white/5 px-4 py-2 rounded-full w-fit">
              <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              Community Funded Project
            </div>
          </div>

          <div className="flex-1 w-full grid grid-cols-1 gap-3">
            {donationAddresses.map((crypto) => (
              <div key={crypto.id} className="group relative flex items-center justify-between p-4 rounded-2xl bg-white/5 border border-white/10 hover:border-blue-500/30 hover:bg-white/10 transition-all duration-300">
                <div className="flex items-center gap-3">
                  {crypto.icon}
                  <div>
                    <div className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{crypto.label}</div>
                    <div className="text-xs font-mono text-slate-300 truncate max-w-[180px] md:max-w-xs">{crypto.address}</div>
                  </div>
                </div>
                <button 
                  onClick={() => copyToClipboard(crypto.address, crypto.id)}
                  className="p-2 rounded-xl bg-white/5 text-slate-400 hover:text-white transition-colors"
                  title="Copy Address"
                >
                  {copied === crypto.id ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="text-center py-8">
        <p className="text-[10px] font-black text-slate-600 uppercase tracking-[0.4em]">
          Data Captured: Jan 03, 2026 • Verified Monthly
        </p>
      </div>
    </div>
  );
};