import { Request, Response, NextFunction } from 'express';
import crypto from 'crypto';
import { config } from '../config';
import { now } from '../utils/time';

const DRIFT_MS = 5 * 60 * 1000;

export function requireApiKey(req: Request, res: Response, next: NextFunction) {
  const provided = (req.header('x-api-key') || '').trim();
  const tsHeader = req.header('x-api-timestamp');
  const secret = config.apiKeyHash;

  if (!tsHeader) {
    return res.status(401).json({ message: 'Missing timestamp' });
  }

  const ts = parseInt(tsHeader, 10);
  if (Number.isNaN(ts) || Math.abs(now().valueOf() - ts) > DRIFT_MS) {
    return res.status(401).json({ message: 'Invalid timestamp' });
  }

  try {
    const valid =
      secret &&
      provided.length === secret.length &&
      crypto.timingSafeEqual(Buffer.from(provided), Buffer.from(secret));
    if (!valid) {
      return res.status(401).json({ message: 'Unauthorized' });
    }
    return next();
  } catch {
    return res.status(401).json({ message: 'Unauthorized' });
  }
}
