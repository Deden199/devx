import { Router } from 'express';
import { PrismaClient } from '@prisma/client';
import { requireSubscription } from '../middleware/subscription';

const router = Router();
const prisma = new PrismaClient();

router.get('/orders', requireSubscription, async (_req, res) => {
  const orders = await prisma.order.findMany();
  res.json(orders);
});

router.get('/settlements', requireSubscription, async (_req, res) => {
  const settlements = await prisma.settlement.findMany();
  res.json(settlements);
});

router.get('/withdrawals', requireSubscription, async (_req, res) => {
  const withdrawals = await prisma.withdrawal.findMany();
  res.json(withdrawals);
});

export default router;
