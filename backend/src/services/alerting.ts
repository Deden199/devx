import { PrismaClient } from '@prisma/client';
import { logger } from '../utils/logger';

const prisma = new PrismaClient();

interface AlertOptions {
  count?: number;
  severity?: 'low' | 'medium' | 'high';
  identifiers?: (string | number)[];
}

export async function raiseAlert(message: string, opts: AlertOptions = {}) {
  const summary = `${message} | count=${opts.count ?? 0} | severity=${
    opts.severity ?? 'low'
  } | ids=${(opts.identifiers || []).join(',')}`;
  const alert = await prisma.alert.create({ data: { message: summary } });
  logger.warn({ alertId: alert.id, ...opts }, 'Alert raised');
  return alert;
}

export async function listAlerts() {
  return prisma.alert.findMany({ orderBy: { createdAt: 'desc' } });
}
