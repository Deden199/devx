import dotenv from 'dotenv';

dotenv.config();

export const config = {
  port: parseInt(process.env.PORT || '4000', 10),
  logLevel: process.env.LOG_LEVEL || 'info',
  subscriptionForce: process.env.SUBSCRIPTION_FORCE === 'true',
  apiKeyHash: process.env.API_KEY_HASH || '',
};
