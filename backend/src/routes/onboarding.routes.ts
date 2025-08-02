import { Router } from 'express';
import { PrismaClient } from '@prisma/client';

const router = Router();
const prisma = new PrismaClient();

router.post('/subscribe', async (req, res) => {
  const { clientId } = req.body;
  const sub = await prisma.subscription.upsert({
    where: { clientId },
    update: { active: true },
    create: { clientId, active: true },
  });
  res.json(sub);
});

router.post('/unsubscribe', async (req, res) => {
  const { clientId } = req.body;
  const sub = await prisma.subscription.update({
    where: { clientId },
    data: { active: false },
  });
  res.json(sub);
});

export default router;
