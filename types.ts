
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

export interface Prediction {
  id: string;
  code: string; 
  model: LLM;
  scope: Scope;
  category: Category;
  title: string;      // From "Title" in PDF
  description: string; // From "Reasoning" in PDF
  confidence: number;  // From "Confidence Level" in PDF
  status: Status;
  timestamp: string;
}
