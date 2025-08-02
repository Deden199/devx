import { PrismaClient } from '@prisma/client';
import { logger } from '../utils/logger';

const prisma = new PrismaClient();

export async function raiseAlert(message: string) {
  const alert = await prisma.alert.create({ data: { message } });
  logger.warn({ alertId: alert.id }, 'Alert raised');
  return alert;
}

export async function listAlerts() {
  return prisma.alert.findMany({ orderBy: { createdAt: 'desc' } });
}
