import { runReconciliation } from '../services/reconciliation';
import { raiseAlert } from '../services/alerting';
import { logger } from '../utils/logger';

const BASE_INTERVAL_MS = 60 * 60 * 1000; // 1 hour
let backoffMs = BASE_INTERVAL_MS;
let timer: NodeJS.Timeout | null = null;

async function execute() {
  try {
    await runReconciliation();
    backoffMs = BASE_INTERVAL_MS;
  } catch (err) {
    logger.error({ err }, 'Scheduled reconciliation failed');
    await raiseAlert('Scheduled reconciliation failed', { severity: 'high' });
    backoffMs = Math.min(backoffMs * 2, 24 * BASE_INTERVAL_MS);
  } finally {
    timer = setTimeout(execute, backoffMs);
  }
}

export function startScheduler() {
  logger.info('Scheduler initialized');
  if (!timer) execute();
}

export function stopScheduler() {
  if (timer) clearTimeout(timer);
  timer = null;
}
