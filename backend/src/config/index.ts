import dotenv from 'dotenv';

dotenv.config();

export const config = {
  port: parseInt(process.env.PORT || '4000', 10),
  logLevel: process.env.LOG_LEVEL || 'info',
  subscriptionEnabled: process.env.SUBSCRIPTION_FEATURE_ENABLED === 'true',
};
