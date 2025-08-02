import { Router } from 'express';
import { getLatestRun, buildExport } from '../services/export';
import { requireSubscription } from '../middleware/subscription';
import { requireApiKey } from '../middleware/auth';

const router = Router();

router.post('/', requireApiKey, requireSubscription, async (req, res) => {
  const format = (req.query.format as string) === 'pdf' ? 'pdf' : 'csv';
  const run = await getLatestRun();
  if (!run) {
    return res.status(404).json({ message: 'No reconciliation run found' });
  }
  const buffer = await buildExport(run, format);
  res.setHeader(
    'Content-Disposition',
    `attachment; filename=reconciliation-${run.id}.${format}`
  );
  res.setHeader('Content-Type', format === 'pdf' ? 'application/pdf' : 'text/csv');
  res.send(buffer);
});

export default router;
