import { DomainError } from '../domain/domain.error.js';
import logger from '../infrastructure/logger/logger.js';

// eslint-disable-next-line no-unused-vars
export function errorHandler(err, _req, res, _next) {
  if (err instanceof DomainError) {
    return res.status(err.status).json({
      success: false,
      message: err.message,
      error: err.name,
    });
  }

  const status = err.status || err.statusCode;
  if (status && status < 500) {
    return res.status(status).json({
      success: false,
      message: err.message,
    });
  }

  logger.error(err);
  const isDev = process.env.NODE_ENV === 'development';
  res.status(status || 500).json({
    success: false,
    message: isDev ? err.message : 'Internal Server Error',
  });
}
