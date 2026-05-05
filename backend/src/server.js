import 'dotenv/config';
import { connectDB } from './shared/infrastructure/database/mongoose.connection.js';
import logger from './shared/infrastructure/logger/logger.js';

import { createApp } from './app.js';

const PORT = process.env.PORT || 3000;

async function bootstrap() {
  await connectDB();
  const app = createApp();
  app.listen(PORT, () => {
    logger.info(`Server running on port ${PORT}`);
  });
}

bootstrap().catch((err) => {
  logger.error('Failed to start server:', err);
  process.exit(1);
});
