
export type LLM = 'Gemini' | 'Claude' | 'ChatGPT' | 'Perplexity' | 'Grok';

export type Scope = 'Brazil' | 'Global' | 'Geopolitics';

export type Category = 
  | 'Politics' 
  | 'War' 
  | 'Tech' 
  | 'AI' 
  | 'Crypto' 
  | 'Finance & Economy' 
  | 'Sports';

export type Status = 'Pending' | 'Confirmed' | 'Debunked' | 'Ongoing';

export interface EvidenceSource {
  title: string;
  url: string;
  sourceName: string;
  date: string;
}

export interface Prediction {
  id: string;
  code: string; // Unique reference code e.g. BR-001
  model: LLM;
  scope: Scope;
  category: Category;
  content: string;
  confidence: number; // 0 to 100
  status: Status;
  timestamp: string;
  reasoning?: string;
  detailedAnalysis?: string;
  evidence?: EvidenceSource[];
  verificationDate?: string;
}

export interface Statistics {
  total: number;
  byModel: Record<LLM, { success: number; failed: number; pending: number }>;
}
