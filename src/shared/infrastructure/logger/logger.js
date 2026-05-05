const levels = { error: 0, warn: 1, info: 2, debug: 3 };
const current = levels[process.env.LOG_LEVEL] ?? levels.info;

const log = (level, ...args) => {
  if (levels[level] <= current) {
    console[level === 'debug' ? 'log' : level](`[${level.toUpperCase()}]`, ...args);
  }
};

const logger = {
  error: (...args) => log('error', ...args),
  warn: (...args) => log('warn', ...args),
  info: (...args) => log('info', ...args),
  debug: (...args) => log('debug', ...args),
};

export default logger;
