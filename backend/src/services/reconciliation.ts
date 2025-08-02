import { PrismaClient } from '@prisma/client';
import { logger } from '../utils/logger';
import { now } from '../utils/time';

const prisma = new PrismaClient();

export async function runReconciliation() {
  const run = await prisma.reconciliationRun.create({
    data: { startedAt: now().toDate(), status: 'running' },
  });
  logger.info({ runId: run.id }, 'Reconciliation run started');
  // TODO: Add real reconciliation logic
  await prisma.reconciliationRun.update({
    where: { id: run.id },
    data: { status: 'completed', finishedAt: now().toDate() },
  });
  logger.info({ runId: run.id }, 'Reconciliation run completed');
  return run;
}
