import 'dotenv/config';
import express, { Request, Response } from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { PREDICTIONS_DATA } from './data';
import { verificationEngine } from './services/verificationService';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

// Enable trust proxy for Nginx ingress/entry reverse proxy
app.set('trust proxy', 1);

app.use(express.json());

// Initialize stored predictions with PREDICTIONS_DATA if empty
let allPredictions = verificationEngine.getStoredPredictions(PREDICTIONS_DATA);

// Seed sample verification queue if empty so the human reviewer immediately has concrete dossiers to review and test!
const initialQueue = verificationEngine.getQueue();
if (initialQueue.length === 0) {
  // Let's seed 3 realistic dossiers for 2026 predictions for initial review
  const seedDossiers = [
    {
      id: 'dossier-br-cl-01-seed',
      predictionId: 'br-cl-01',
      predictionCode: 'BR-CL-01',
      predictionTitle: 'Slowed Economic Growth with Persistent Inflation',
      model: 'Claude' as const,
      scope: 'Brazil' as const,
      category: 'Finance & Economy' as const,
      suggestedStatus: 'Confirmed' as const,
      confidence: 88,
      evaluatedAt: new Date(Date.now() - 3600000 * 24 * 3).toISOString(),
      reasoning: 'Central Bank of Brazil and Focus bulletin reports in 2026 confirm GDP growth slowing to 1.7% while annual IPCA inflation hovered near 4.15%, aligning with the projected moderate stagnation and high Selic scenario.',
      evidence: [
        {
          sourceTitle: 'Banco Central do Brasil - Relatório Focus 2026',
          sourceUrl: 'https://www.bcb.gov.br',
          snippet: 'Expectativas de mercado para IPCA e PIB 2026 mantêm projeção de taxa Selic restritiva.',
          publishedDate: '2026-03-15'
        },
        {
          sourceTitle: 'Valor Econômico - Cenário Macroeconômico',
          sourceUrl: 'https://valor.globo.com',
          snippet: 'Crescimento moderado e inflação persistente limitam cortes de juros.',
          publishedDate: '2026-04-10'
        }
      ],
      reviewStatus: 'pending_review' as const
    },
    {
      id: 'dossier-br-cl-05-seed',
      predictionId: 'br-cl-05',
      predictionCode: 'BR-CL-05',
      predictionTitle: 'Crypto Regulation Comes into Effect with Significant Market Impact',
      model: 'Claude' as const,
      scope: 'Brazil' as const,
      category: 'Crypto' as const,
      suggestedStatus: 'Confirmed' as const,
      confidence: 94,
      evaluatedAt: new Date(Date.now() - 3600000 * 24 * 5).toISOString(),
      reasoning: 'Central Bank Resolutions No. 519, 520, and 521 officially took effect on February 2, 2026. The DeCripto compliance requirements have mandated foreign exchanges to submit transaction ledgers.',
      evidence: [
        {
          sourceTitle: 'Receita Federal - Instrução Normativa DeCripto',
          sourceUrl: 'https://www.gov.br/receitafederal',
          snippet: 'Regulamentação e obrigações de reporte para prestadoras de serviços de ativos virtuais.',
          publishedDate: '2026-02-05'
        }
      ],
      reviewStatus: 'pending_review' as const
    },
    {
      id: 'dossier-br-cl-02-seed',
      predictionId: 'br-cl-02',
      predictionCode: 'BR-CL-02',
      predictionTitle: 'Lula Wins Presidential Elections with a Comfortable Margin',
      model: 'Claude' as const,
      scope: 'Brazil' as const,
      category: 'Politics' as const,
      suggestedStatus: 'Pending' as const,
      confidence: 82,
      evaluatedAt: new Date(Date.now() - 3600000 * 24 * 7).toISOString(),
      reasoning: 'The presidential election is scheduled for October 4, 2026. While campaign developments and polling continue, the outcome cannot be confirmed until votes are counted.',
      evidence: [
        {
          sourceTitle: 'Tribunal Superior Eleitoral (TSE) - Calendário Eleitoral 2026',
          sourceUrl: 'https://www.tse.jus.br',
          snippet: 'Primeiro turno das Eleições Gerais de 2026 está marcado para o primeiro domingo de outubro.',
          publishedDate: '2026-01-10'
        }
      ],
      reviewStatus: 'pending_review' as const
    }
  ];
  verificationEngine.saveQueue(seedDossiers);
}

// ----------------- PUBLIC API ROUTES ----------------- //

// Health check route
app.get('/api/health', (_req: Request, res: Response) => {
  res.json({ status: 'healthy', uptime: process.uptime(), timestamp: new Date().toISOString() });
});

// Get all predictions with current verification statuses
app.get('/api/predictions', (_req: Request, res: Response) => {
  const predictions = verificationEngine.getStoredPredictions(allPredictions);
  res.json({ success: true, predictions });
});

// ----------------- ADMIN API ROUTES ----------------- //

// Admin Login
app.post('/api/admin/login', (req: Request, res: Response) => {
  const { password } = req.body;
  const adminPassword = process.env.ADMIN_PASSWORD || 'jb2GFPwfVHgBJWsB2J4Kao';
  if (password === adminPassword) {
    res.json({ success: true, message: 'Authentication successful', token: 'oracle-admin-token' });
  } else {
    res.status(401).json({ success: false, message: 'Invalid administrative password' });
  }
});

// Get verification review queue
app.get('/api/admin/queue', (_req: Request, res: Response) => {
  const queue = verificationEngine.getQueue();
  res.json({ success: true, queue });
});

// Human in the loop review decision
app.post('/api/admin/review', (req: Request, res: Response) => {
  const { dossierId, action, status, adminNotes } = req.body;

  if (!dossierId || !action) {
    res.status(400).json({ success: false, message: 'Missing dossierId or action parameter.' });
    return;
  }

  try {
    const result = verificationEngine.applyHumanReview(dossierId, action, status, adminNotes);
    res.json({
      success: true,
      message: `Verification review applied: ${action}`,
      prediction: result.prediction,
      queue: result.queue
    });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message || 'Failed to apply review' });
  }
});

// Systematic Queue Processing Endpoints
app.get('/api/admin/scan/state', (_req: Request, res: Response) => {
  res.json({
    success: true,
    scanState: verificationEngine.getScanState(),
    status: verificationEngine.getStatus()
  });
});

app.post('/api/admin/scan/start', async (req: Request, res: Response) => {
  const { scope, model, unverifiedOnly, predictionIds } = req.body;
  const predictions = verificationEngine.getStoredPredictions(allPredictions);

  try {
    const scanState = await verificationEngine.startSystematicScan(predictions, {
      scope: scope || 'All',
      model: model || 'All',
      unverifiedOnly: unverifiedOnly !== false,
      predictionIds
    });

    res.json({
      success: true,
      message: `Systematic queue scan started for ${model || 'All models'} (${scope || 'All scopes'}). All pending predictions queued.`,
      scanState
    });
  } catch (err: any) {
    res.status(400).json({ success: false, message: err.message || 'Failed to start queue scan.' });
  }
});

app.post('/api/admin/scan/pause', (_req: Request, res: Response) => {
  try {
    const scanState = verificationEngine.pauseScan();
    res.json({ success: true, message: 'Scan paused.', scanState });
  } catch (err: any) {
    res.status(400).json({ success: false, message: err.message });
  }
});

app.post('/api/admin/scan/resume', async (_req: Request, res: Response) => {
  try {
    const predictions = verificationEngine.getStoredPredictions(allPredictions);
    const scanState = await verificationEngine.resumeScan(predictions);
    res.json({ success: true, message: 'Scan resumed.', scanState });
  } catch (err: any) {
    res.status(400).json({ success: false, message: err.message });
  }
});

app.post('/api/admin/scan/cancel', (_req: Request, res: Response) => {
  try {
    const scanState = verificationEngine.cancelScan();
    res.json({ success: true, message: 'Scan cancelled.', scanState });
  } catch (err: any) {
    res.status(400).json({ success: false, message: err.message });
  }
});

app.post('/api/admin/scan/reset', (_req: Request, res: Response) => {
  try {
    const scanState = verificationEngine.resetScanState();
    res.json({ success: true, message: 'Scan queue reset to initial state.', scanState });
  } catch (err: any) {
    res.status(400).json({ success: false, message: err.message });
  }
});

// Trigger batch verification run (backward compatible)
app.post('/api/admin/batch-verify', async (req: Request, res: Response) => {
  const { scope, model, batchSize, predictionIds, unverifiedOnly } = req.body;
  const predictions = verificationEngine.getStoredPredictions(allPredictions);

  try {
    // If no batchSize or batchSize is large (or user wants all), route to systematic full scan
    if (!batchSize || batchSize >= 100) {
      const scanState = await verificationEngine.startSystematicScan(predictions, {
        scope,
        model,
        predictionIds,
        unverifiedOnly: unverifiedOnly !== false
      });
      res.json({
        success: true,
        message: 'Full systematic queue scan initiated across all pending predictions without skipping.',
        scanState,
        status: verificationEngine.getStatus()
      });
      return;
    }

    // Start asynchronous batch run
    const runPromise = verificationEngine.runBatchVerification(predictions, {
      scope,
      model,
      batchSize: typeof batchSize === 'number' ? batchSize : 6,
      predictionIds,
      unverifiedOnly: unverifiedOnly !== false
    });

    // Return immediate response with engine status
    res.json({
      success: true,
      message: 'Verification batch triggered successfully in background.',
      status: verificationEngine.getStatus()
    });

    // Await run in background
    runPromise.catch(e => console.error('Background batch run error:', e));
  } catch (err: any) {
    res.status(400).json({ success: false, message: err.message });
  }
});


// Verify a single prediction on-demand (via search)
app.post('/api/admin/verify-single', async (req: Request, res: Response) => {
  const { predictionId, customSearchTerms } = req.body;
  const predictions = verificationEngine.getStoredPredictions(allPredictions);
  const target = predictions.find(p => p.id === predictionId || p.code === predictionId);

  if (!target) {
    res.status(404).json({ success: false, message: 'Prediction not found.' });
    return;
  }

  try {
    const dossier = await verificationEngine.verifyPrediction(target, undefined, customSearchTerms);
    
    // Add to queue
    const queue = verificationEngine.getQueue();
    const existingIdx = queue.findIndex(q => q.predictionId === target.id && q.reviewStatus === 'pending_review');
    if (existingIdx >= 0) {
      queue[existingIdx] = dossier;
    } else {
      queue.unshift(dossier);
    }
    verificationEngine.saveQueue(queue);

    res.json({
      success: true,
      message: `Verified news for ${target.code}. Queued for human review.`,
      dossier
    });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message || 'Verification failed.' });
  }
});

// Verify a prediction using a user-informed custom URL
app.post('/api/admin/verify-with-url', async (req: Request, res: Response) => {
  const { predictionId, url, customSearchTerms } = req.body;

  if (!predictionId || !url) {
    res.status(400).json({ success: false, message: 'Missing predictionId or url.' });
    return;
  }

  const predictions = verificationEngine.getStoredPredictions(allPredictions);
  const target = predictions.find(p => p.id === predictionId || p.code === predictionId);

  if (!target) {
    res.status(404).json({ success: false, message: 'Prediction not found.' });
    return;
  }

  try {
    const dossier = await verificationEngine.verifyPrediction(target, url.trim(), customSearchTerms);

    // Update in queue
    const queue = verificationEngine.getQueue();
    const existingIdx = queue.findIndex(q => q.predictionId === target.id && q.reviewStatus === 'pending_review');
    if (existingIdx >= 0) {
      queue[existingIdx] = dossier;
    } else {
      queue.unshift(dossier);
    }
    verificationEngine.saveQueue(queue);

    res.json({
      success: true,
      message: `Analyzed ${target.code} against provided URL. Queued for approval.`,
      dossier
    });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message || 'Custom URL verification failed.' });
  }
});

// Status and runs history
app.get('/api/admin/status', (_req: Request, res: Response) => {
  res.json({
    success: true,
    status: verificationEngine.getStatus()
  });
});

app.get('/api/admin/runs', (_req: Request, res: Response) => {
  res.json({
    success: true,
    runs: verificationEngine.getRuns()
  });
});

// ----------------- AUTOMATED MONTHLY SCHEDULER ----------------- //
// Checks every 6 hours if a new calendar month has elapsed since the last automated check
setInterval(() => {
  try {
    const runs = verificationEngine.getRuns();
    const now = new Date();
    const currentMonth = now.toLocaleString('en-US', { month: 'long', year: 'numeric' });
    const lastRun = runs[0];

    // If no run recorded this month, trigger systematic queue scan through all pending predictions
    if (!lastRun || lastRun.month !== currentMonth) {
      console.log(`[Monthly Automation] Triggering automated systematic news check for ${currentMonth}...`);
      const predictions = verificationEngine.getStoredPredictions(allPredictions);
      verificationEngine.startSystematicScan(predictions, {
        scope: 'All',
        model: 'All',
        unverifiedOnly: true
      }).catch(err => {
        console.error('[Monthly Automation] Scheduled systematic scan error:', err);
      });
    }
  } catch (cronErr) {
    console.error('[Monthly Automation] Scheduler tick error:', cronErr);
  }
}, 6 * 60 * 60 * 1000); // 6 hours


// ----------------- VITE INTEGRATION ----------------- //
async function startServer() {
  const isDev = process.env.NODE_ENV !== 'production';

  if (isDev) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    // Serve static frontend build
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (_req: Request, res: Response) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, () => {
    console.log(`LLM Oracle 2026 server running at http://localhost:${PORT}`);
  });
}

startServer();
