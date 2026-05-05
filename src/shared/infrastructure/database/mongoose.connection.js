import mongoose from 'mongoose';
import logger from '../logger/logger.js';

export async function connectDB() {
  const uri = process.env.MONGODB_URI;
  await mongoose.connect(uri);
  logger.info(`MongoDB connected: ${mongoose.connection.host}`);
}
