import { Router } from 'express';
import { runReconciliation } from '../services/reconciliation';
import { requireSubscription } from '../middleware/subscription';

const router = Router();

router.post('/', requireSubscription, async (_req, res) => {
  const run = await runReconciliation();
  res.json(run);
});

export default router;
