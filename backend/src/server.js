import 'dotenv/config';
import { connectDB, syncAllIndexes } from './shared/infrastructure/database/mongoose.connection.js';
import logger from './shared/infrastructure/logger/logger.js';

import { createApp } from './app.js';

const REQUIRED_ENV = ['JWT_SECRET', 'MONGODB_URI'];
const missing = REQUIRED_ENV.filter((key) => !process.env[key]);
if (missing.length > 0) {
  logger.error(`Missing required environment variables: ${missing.join(', ')}`);
  process.exit(1);
}

const PORT = process.env.PORT || 3001;

async function bootstrap() {
  await connectDB();
  const app = createApp();
  await syncAllIndexes();
  app.listen(PORT, () => {
    logger.info(`Server running on port ${PORT}`);
    logger.info(`Swagger docs: http://localhost:${PORT}/api/v1/docs`);
  });
}

bootstrap().catch((err) => {
  logger.error('Failed to start server:', err);
  process.exit(1);
});
