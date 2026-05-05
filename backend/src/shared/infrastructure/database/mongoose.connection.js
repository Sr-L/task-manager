import mongoose from 'mongoose';
import logger from '../logger/logger.js';

export async function connectDB() {
  const uri = process.env.MONGODB_URI;
  await mongoose.connect(uri);
  logger.info(`MongoDB connected: ${mongoose.connection.host}`);
}

export async function syncAllIndexes() {
  const models = Object.values(mongoose.models);
  await Promise.all(models.map((m) => m.syncIndexes()));
  logger.info(`Indexes synced for ${models.length} model(s)`);
}
