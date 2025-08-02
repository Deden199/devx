import { Router } from 'express';
import { raiseAlert, listAlerts } from '../services/alerting';

const router = Router();

router.get('/', async (_req, res) => {
  const alerts = await listAlerts();
  res.json(alerts);
});

router.post('/', async (req, res) => {
  const { message } = req.body;
  const alert = await raiseAlert(message);
  res.json(alert);
});

export default router;
