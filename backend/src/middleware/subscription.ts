import { Request, Response, NextFunction } from 'express';
import { config } from '../config';

export function requireSubscription(req: Request, res: Response, next: NextFunction) {
  if (!config.subscriptionEnabled) {
    return res.status(403).json({ message: 'Subscription required' });
  }
  next();
}
