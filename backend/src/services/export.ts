import { PrismaClient, ReconciliationRun } from '@prisma/client';
import PDFDocument from 'pdfkit';
import { logger } from '../utils/logger';
import { format, now } from '../utils/time';

const prisma = new PrismaClient();

export async function getLatestRun(): Promise<ReconciliationRun | null> {
  return prisma.reconciliationRun.findFirst({ orderBy: { startedAt: 'desc' } });
}

interface ReportData {
  totalOrders: number;
  totalSettlements: number;
  gapPercentage: number;
  anomalies: { id: number; reference: string; amount: number }[];
  trend: { date: string; gap: number }[];
}

async function collectData(): Promise<ReportData> {
  const totalOrders = await prisma.order.count();
  const totalSettlements = await prisma.settlement.count();
  const gapPercentage =
    totalOrders === 0
      ? 0
      : Number((((totalOrders - totalSettlements) / totalOrders) * 100).toFixed(2));

  const anomalies = await prisma.order.findMany({
    where: { settlement: null },
    select: { id: true, reference: true, amount: true },
    take: 50,
  });

  const trend: { date: string; gap: number }[] = [];
  for (let i = 6; i >= 0; i--) {
    const dayStart = now().subtract(i, 'day').startOf('day');
    const dayEnd = dayStart.endOf('day');
    const dayOrders = await prisma.order.count({
      where: { createdAt: { gte: dayStart.toDate(), lte: dayEnd.toDate() } },
    });
    const daySettled = await prisma.settlement.count({
      where: { createdAt: { gte: dayStart.toDate(), lte: dayEnd.toDate() } },
    });
    const dayGap =
      dayOrders === 0 ? 0 : Number((((dayOrders - daySettled) / dayOrders) * 100).toFixed(2));
    trend.push({ date: dayStart.format('YYYY-MM-DD'), gap: dayGap });
  }

  return { totalOrders, totalSettlements, gapPercentage, anomalies, trend };
}

export async function buildExport(
  run: ReconciliationRun,
  formatType: 'csv' | 'pdf'
): Promise<Buffer> {
  logger.info({ runId: run.id, format: formatType }, 'Building reconciliation export');
  const data = await collectData();

  if (formatType === 'csv') {
    const lines: string[] = [];
    lines.push('totalOrders,totalSettlements,gapPercentage');
    lines.push(`${data.totalOrders},${data.totalSettlements},${data.gapPercentage}`);
    lines.push('');
    lines.push('anomalies');
    lines.push('id,reference,amount');
    data.anomalies.forEach((a) => lines.push(`${a.id},${a.reference},${a.amount}`));
    lines.push('');
    lines.push('trend');
    lines.push('date,gapPercentage');
    data.trend.forEach((t) => lines.push(`${t.date},${t.gap}`));
    return Buffer.from(lines.join('\n'));
  }

  const doc = new PDFDocument();
  const chunks: Buffer[] = [];
  doc.on('data', (c) => chunks.push(c));

  doc.fontSize(20).text('Reconciliation Report', { align: 'center' });
  doc.moveDown();
  doc.fontSize(12).text(`Run ID: ${run.id}`);
  doc.text(`Started: ${format(run.startedAt)}`);
  if (run.finishedAt) doc.text(`Finished: ${format(run.finishedAt)}`);
  doc.moveDown();
  doc.text(`Total Orders: ${data.totalOrders}`);
  doc.text(`Total Settlements: ${data.totalSettlements}`);
  doc.text(`Gap Percentage: ${data.gapPercentage}%`);
  doc.moveDown();

  doc.fontSize(14).text('Anomalies', { underline: true });
  data.anomalies.forEach((a) => {
    doc.fontSize(12).text(`• Order ${a.id} (${a.reference}) amount ${a.amount}`);
  });
  doc.moveDown();

  doc.fontSize(14).text('Trend (last 7 days)', { underline: true });
  data.trend.forEach((t) => {
    doc.fontSize(12).text(`${t.date}: ${t.gap}%`);
  });

  doc.end();

  return new Promise<Buffer>((resolve, reject) => {
    doc.on('end', () => resolve(Buffer.concat(chunks)));
    doc.on('error', reject);
  });
}
