# Monthly Prediction Verification Engine & Human-in-the-Loop Review System

A secure, server-side monthly automated verification engine that systematically scans recent news via Gemini with Google Search Grounding to evaluate 2026 predictions across Brazil, Global, and Geopolitics, providing an interactive Human-in-the-Loop review queue for final human approval.

## User Review & Critical Decisions

> [!IMPORTANT]
> The following architectural and workflow decisions were confirmed during Phase 1 clarification:

- **Confirmed Decision 1: Server-Side Execution**: The automated news checking engine runs entirely in the backend (Express server), completely inaccessible to public site visitors. The frontend never makes direct search or verification requests.
- **Confirmed Decision 2: Human-in-the-Loop In-App Review Station**: Predictions are not auto-committed to public stats blindly. Instead, the backend populates an interactive admin review queue showing proposed status changes, confidence scores, reasoning, and cited news sources for human approval or modification.
- **Confirmed Decision 3: Gemini with Google Search Grounding**: The verification engine queries `gemini-3.8-flash` equipped with live `{ googleSearch: {} }` grounding to fetch current real-time news articles, press releases, and economic indices before synthesizing a verification verdict.
- **Confirmed Decision 4: Monthly Automation Schedule & Manual On-Demand Trigger**: In addition to an automated monthly recurring background run (1st of each month via scheduled task), the system provides an authenticated on-demand "Run Monthly Verification Batch" trigger inside the Admin portal for testing and specific monthly cycles.

---

## 1. Overview & Core Concept

### What It Does
The LLM Oracle 2026 platform currently tracks over 100 strategic predictions made by leading models (Claude, ChatGPT, Gemini, Perplexity, Grok). This feature introduces an end-to-end verification pipeline:
1. **Automated Search & Evaluation**: Once a month (or on-demand by the admin), a backend service iterates over pending and ongoing predictions, searches recent news via Gemini with Google Search grounding, and analyzes whether the predicted events occurred, were debunked, or remain pending.
2. **Evidence Dossier Generation**: For each prediction, the system produces a structured dossier: suggested status (`Confirmed`, `Debunked`, `Ongoing`, `Pending`), AI verification reasoning, relevant quotes, and cited news URLs with dates.
3. **Human-in-the-Loop Review Station**: Inside the authenticated Admin view, the curator reviews each suggested verification item with diff comparisons, edits notes/status if needed, and clicks "Approve", "Modify & Approve", or "Dismiss".
4. **Public Status Synchronization**: Approved verifications immediately update the public prediction ledger, recalculating model accuracy scores, category trends, and timeline milestones.

### Target Audience / Persona
- **Oracle Administrator / Curators (Patrick & research team)**: Requires an efficient, trustworthy review console where AI acts as a research assistant, leaving final epistemological authority in human hands.
- **Public Observers & Analysts**: Gain access to verified predictions backed by real citation links and clear timestamps.

---

## 2. User Experience & Visual Design

### Key User Flows

#### A. Monthly Run & Status Overview
1. Admin enters Admin Mode (`oracle2026` or dedicated admin token).
2. Admin opens the **"Verification Center"** tab.
3. The header displays:
   - Last automated monthly run date and next scheduled run.
   - Batch status indicator (`Idle`, `Running`, `Completed`).
   - Summary pills: `Pending Human Review (X)`, `Approved this Month (Y)`, `Auto-checked Total (Z)`.
   - Primary action: **"Run Monthly Check"** with scope selector (All, Brazil, Global, Geopolitics).

#### B. Human-in-the-Loop Review Queue
1. Review queue displays cards for predictions flagged by the latest run.
2. Each review card presents a high-density, side-by-side comparison:
   - **Original Prediction**: Code, Model, Scope, Category, Title, Original Confidence, and 2026 Horizon.
   - **AI Suggested Verdict**: Proposed Status (`Confirmed`, `Debunked`, `Ongoing`), Confidence, and Evaluation Timestamp.
   - **Cited News Sources**: Clickable publisher links with article titles, domain badges, and snippets.
   - **AI Analysis**: Concise factual summary explaining why the evidence meets or fails the prediction criteria.
3. **Human Action Controls**:
   - `Approve Verdict`: Adopts the suggested status and adds verification notes with sources.
   - `Modify & Approve`: Opens an inline edit drawer to tweak the status, override reasoning, or add custom notes.
   - `Keep Pending / Dismiss`: Retains the prediction in its current state if news is inconclusive.
   - `Batch Approve Selected`: Fast-tracks high-confidence matches.

#### C. Public Verification Badge & Audit Trail
- On public prediction cards and deep-dive modals, verified predictions display an unboxed verified mark with a "Verification Dossier" toggle showing the verification date, human approval status, and cited source links.

### Visual Identity & Theme
- **Color Tokens**:
  - Background: Deep slate (`#020617` / `slate-950`) with subtle radial illumination.
  - Surface panels: `slate-900/80` with crisp 1px borders (`border-slate-800`).
  - Status Accents:
    - Confirmed: Emerald (`#10B981`)
    - Debunked: Rose (`#F43F5E`)
    - Ongoing/Partial: Amber (`#F59E0B`)
    - Pending: Slate/Blue (`#38BDF8`)
- **Typography**: Clean sans-serif hierarchy paired with tabular monospace numerals (`font-mono tabular-nums`) for timestamps, confidence percentages, and prediction codes (`BR-CL-01`, `GL-GP-04`).
- **Zero-Pill Discipline**: Metadata rendered with typographic dividers (`·` and `/`) without gratuitous bubble wraps.

---

## 3. Key Product Decisions & Trade-Offs

### Decision 1: Architecture & Full-Stack Server
- **Chosen Approach**: Transition the Vite dev setup to a full-stack Node.js + Express backend (`server.ts`) running on port 3000 with Vite middleware mounted.
- **Why**: Keeps the Gemini API key protected on the server, allows a scheduled cron runner or background queue to process large batches without browser timeouts, and provides secure REST endpoints (`/api/admin/verify/*`).
- **Alternative Considered**: Client-side fetch with browser API keys (rejected because user explicitly requested backend execution and keys must never leak to visitors).

### Decision 2: Verification Data Storage
- **Chosen Approach**: Server-side JSON persistence (`/data/verifications.json` and `/data/audit-log.json`) combined with in-memory state and public data synchronization.
- **Why**: Allows instant persistence across sessions, simple deployment, and zero database lock-in, while maintaining compatibility with the existing static `data.ts` baseline.

### Decision 3: Grounded Search Prompting Strategy
- **Chosen Approach**: Use `@google/genai` with model `gemini-3.8-flash` and `{ googleSearch: {} }` tool. The prompt instructs the model to search for 2026 news events matching the specific prediction, extract factual outcomes, evaluate against the original claim, and return structured JSON containing verdict, confidence, summary, and citations.
- **Why**: Provides real-time fresh news retrieval with authentic URLs, avoiding hallucinations.

---

## 4. Technical Architecture & Data Strategy

### System Architecture Diagram

```
┌────────────────────────────────────────────────────────────────────────┐
│                        PUBLIC FRONTEND (REACT)                         │
│  - Public Predictions Grid & Deep Dive Modal                           │
│  - Real-time Analytics & Accuracy Scorecards                           │
│  - Verification Dossier & Citation Links (Read-only)                   │
└───────────────────────────────────┬────────────────────────────────────┘
                                    │
                         REST API   │ (Public GET /api/predictions)
                                    ▼
┌────────────────────────────────────────────────────────────────────────┐
│                      EXPRESS BACKEND (server.ts)                       │
│                                                                        │
│  ┌──────────────────────┐              ┌───────────────────────────┐  │
│  │ Public API Endpoints │              │ Authenticated Admin API   │  │
│  │ - GET /api/data      │              │ - POST /api/admin/verify  │  │
│  │ - GET /api/stats     │              │ - GET  /api/admin/queue   │  │
│  └──────────────────────┘              │ - POST /api/admin/approve │  │
│                                        │ - POST /api/admin/reject  │  │
│                                        └─────────────┬─────────────┘  │
│                                                      │                │
│  ┌───────────────────────────────────────────────────┼─────────────┐  │
│  │ VERIFICATION ENGINE SERVICE                       │             │  │
│  │  - Scheduled Cron (1st of month) or On-Demand Run │             │  │
│  │  - Rate-limited batch processor                   │             │  │
│  │  - Calls @google/genai SDK                        │             │  │
│  └───────────────────────────┬───────────────────────┴─────────────┘  │
└──────────────────────────────┼────────────────────────────────────────┘
                               │
                               ▼
┌────────────────────────────────────────────────────────────────────────┐
│              GEMINI 3.8 FLASH + GOOGLE SEARCH GROUNDING                │
│  - Searches current live news & publications                           │
│  - Analyzes outcomes vs prediction criteria                            │
│  - Generates verdict, reasoning & citation metadata                    │
└────────────────────────────────────────────────────────────────────────┘
```

### Data Model Additions

```typescript
export interface VerificationEvidence {
  sourceTitle: string;
  sourceUrl: string;
  snippet?: string;
  publishedDate?: string;
}

export interface VerificationDossier {
  predictionId: string;
  suggestedStatus: Status;
  confidence: number;
  evaluatedAt: string;
  reasoning: string;
  evidence: VerificationEvidence[];
  reviewedBy?: string;
  reviewedAt?: string;
  status: 'pending_review' | 'approved' | 'rejected' | 'modified';
  adminNotes?: string;
}
```

### Server API Endpoints
- `POST /api/admin/batch-verify`: Triggers a background verification run for selected scopes or pending items.
- `GET /api/admin/verification-queue`: Retrieves all dossiers awaiting human review.
- `POST /api/admin/approve-verification`: Applies a human decision (approves, modifies, or rejects) and updates public records.
- `GET /api/admin/verification-history`: Fetches previous monthly verification logs.
