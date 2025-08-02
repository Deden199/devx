import { Request, Response, NextFunction } from 'express';
import { PrismaClient } from '@prisma/client';
import { config } from '../config';
import { now } from '../utils/time';

// In future, clientId should be derived from auth context
const CLIENT_ID = 'default-client';
const prisma = new PrismaClient();

export async function requireSubscription(
  _req: Request,
  res: Response,
  next: NextFunction
) {
  if (config.subscriptionForce) {
    return next();
  }

  try {
    const sub = await prisma.subscription.findUnique({
      where: { clientId: CLIENT_ID },
    });

    if (!sub || sub.status !== 'ACTIVE' || now().isAfter(sub.expiresAt)) {
      return res.status(403).json({ message: 'Subscription required' });
    }

    return next();
  } catch (err) {
    return res.status(500).json({ message: 'Subscription check failed' });
  }
}
