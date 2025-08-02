import express from 'express';
import { config } from './config';
import { logger } from './utils/logger';
import reconcileRoutes from './routes/reconcile.routes';
import onboardingRoutes from './routes/onboarding.routes';
import alertsRoutes from './routes/alerts.routes';
import transactionsRoutes from './routes/transactions.routes';

const app = express();
app.use(express.json());

app.use('/reconcile', reconcileRoutes);
app.use('/onboarding', onboardingRoutes);
app.use('/alerts', alertsRoutes);
app.use('/transactions', transactionsRoutes);

app.listen(config.port, () => {
  logger.info(`Server listening on port ${config.port}`);
});
