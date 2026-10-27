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

export type Status = 'Pending' | 'Confirmed' | 'Debunked';

export interface VerificationEvidence {
  sourceTitle: string;
  sourceUrl: string;
  snippet?: string;
  publishedDate?: string;
}

export interface VerificationDossier {
  id: string;
  predictionId: string;
  predictionCode: string;
  predictionTitle: string;
  model: LLM;
  scope: Scope;
  category: Category;
  suggestedStatus: Status;
  confidence: number;
  evaluatedAt: string;
  reasoning: string;
  evidence: VerificationEvidence[];
  reviewStatus: 'pending_review' | 'approved' | 'rejected' | 'modified';
  reviewedAt?: string;
  reviewedBy?: string;
  adminNotes?: string;
}

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
  verifiedAt?: string;
  verifiedNotes?: string;
  verifiedSources?: VerificationEvidence[];
}

export interface MonthlyVerificationRun {
  id: string;
  timestamp: string;
  month: string; // e.g. "October 2026"
  totalChecked: number;
  suggestedConfirmed: number;
  suggestedDebunked: number;
  suggestedPending: number;
  status: 'running' | 'completed' | 'failed';
  error?: string;
}

export interface QueueScanLog {
  timestamp: string;
  predictionCode: string;
  model: LLM;
  status: Status;
  confidence: number;
  message: string;
  type: 'success' | 'info' | 'warn' | 'error';
}

export interface QueueScanState {
  isScanning: boolean;
  isPaused: boolean;
  isCompleted: boolean;
  currentIndex: number;
  totalItems: number;
  currentPredictionCode?: string;
  currentModel?: LLM;
  currentTitle?: string;
  processedCount: number;
  confirmedCount: number;
  debunkedCount: number;
  pendingCount: number;
  failedCount: number;
  startedAt?: string;
  lastUpdatedAt?: string;
  completedAt?: string;
  activeRunId?: string;
  filter: {
    scope: Scope | 'All';
    model: LLM | 'All';
    unverifiedOnly: boolean;
  };
  recentLogs: QueueScanLog[];
}

