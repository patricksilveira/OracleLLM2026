
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

export type Status = 'Pending' | 'Success' | 'Failed' | 'Partial';

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
}

export interface Statistics {
  total: number;
  byModel: Record<LLM, { success: number; failed: number; pending: number }>;
}
