
import React from 'react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Cell,
  PieChart,
  Pie
} from 'recharts';
import { Prediction, LLM } from '../types';

interface StatsProps {
  predictions: Prediction[];
}

interface ModelStat {
  name: string;
  count: number;
  confidence: number;
}

// Hex mapping for LLM brand colors to be used in Recharts
const LLM_HEX_COLORS: Record<LLM, string> = {
  'Gemini': '#60a5fa',    // blue-400
  'Claude': '#fb923c',    // orange-400
  'ChatGPT': '#34d399',   // emerald-400
  'Perplexity': '#22d3ee', // cyan-400
  'Grok': '#e2e8f0'       // slate-200
};

export const Stats: React.FC<StatsProps> = ({ predictions }) => {
  const modelStats = predictions.reduce((acc, curr) => {
    if (!acc[curr.model]) {
      acc[curr.model] = { name: curr.model, count: 0, confidence: 0 };
    }
    acc[curr.model].count += 1;
    acc[curr.model].confidence += curr.confidence;
    return acc;
  }, {} as Record<string, ModelStat>);

  const chartData = (Object.values(modelStats) as ModelStat[]).map(m => ({
    ...m,
    avgConfidence: Math.round(m.confidence / m.count)
  }));

  const categoryData = predictions.reduce((acc, curr) => {
    const existing = acc.find(a => a.name === curr.category);
    if (existing) {
      existing.value += 1;
    } else {
      acc.push({ name: curr.category, value: 1 });
    }
    return acc;
  }, [] as { name: string; value: number }[]);

  const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899', '#06b6d4', '#64748b'];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
      <div className="glass rounded-3xl p-8">
        <h3 className="text-xl font-bold mb-6 text-slate-100 flex items-center gap-2">
          Model Confidence Distribution
          <span className="text-xs font-normal text-slate-500 bg-white/5 px-2 py-1 rounded">Avg. Score</span>
        </h3>
        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
              <XAxis dataKey="name" stroke="#64748b" fontSize={12} axisLine={false} tickLine={false} />
              <YAxis hide />
              <Tooltip 
                contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '12px' }}
                itemStyle={{ color: '#f8fafc' }}
                cursor={{ fill: 'rgba(255,255,255,0.05)' }}
              />
              <Bar dataKey="avgConfidence" radius={[8, 8, 0, 0]} barSize={40}>
                {chartData.map((entry, index) => (
                  <Cell 
                    key={`cell-${index}`} 
                    fill={LLM_HEX_COLORS[entry.name as LLM] || '#3b82f6'} 
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="glass rounded-3xl p-8">
        <h3 className="text-xl font-bold mb-6 text-slate-100 flex items-center gap-2">
          Thematic Focus
          <span className="text-xs font-normal text-slate-500 bg-white/5 px-2 py-1 rounded">Prediction Count</span>
        </h3>
        <div className="h-64 w-full flex items-center justify-center">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={categoryData}
                innerRadius={60}
                outerRadius={80}
                paddingAngle={5}
                dataKey="value"
              >
                {categoryData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip 
                contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '12px' }}
                itemStyle={{ color: '#f8fafc' }}
              />
            </PieChart>
          </ResponsiveContainer>
          <div className="flex flex-col gap-2 max-h-64 overflow-y-auto pl-4 custom-scrollbar">
            {categoryData.map((c, i) => (
              <div key={c.name} className="flex items-center gap-2 text-xs">
                <div className="w-2 h-2 rounded-full" style={{ backgroundColor: COLORS[i % COLORS.length] }} />
                <span className="text-slate-400">{c.name}:</span>
                <span className="text-slate-100 font-bold">{c.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
