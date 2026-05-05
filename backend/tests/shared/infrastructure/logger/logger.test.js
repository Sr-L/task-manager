import { jest, describe, it, expect, beforeEach, afterEach, afterAll } from '@jest/globals';

const LOGGER_PATH = '../../../../src/shared/infrastructure/logger/logger.js';

async function loadLogger(level) {
  if (level === undefined) {
    delete process.env.LOG_LEVEL;
  } else {
    process.env.LOG_LEVEL = level;
  }
  jest.resetModules();
  const mod = await import(LOGGER_PATH);
  return mod.default;
}

describe('logger', () => {
  const originalLevel = process.env.LOG_LEVEL;
  let errorSpy;
  let warnSpy;
  let infoSpy;
  let logSpy;

  beforeEach(() => {
    errorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    warnSpy = jest.spyOn(console, 'warn').mockImplementation(() => {});
    infoSpy = jest.spyOn(console, 'info').mockImplementation(() => {});
    logSpy = jest.spyOn(console, 'log').mockImplementation(() => {});
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  afterAll(() => {
    if (originalLevel === undefined) delete process.env.LOG_LEVEL;
    else process.env.LOG_LEVEL = originalLevel;
  });

  describe('default level (info)', () => {
    let logger;
    beforeEach(async () => {
      logger = await loadLogger(undefined);
    });

    it('error → console.error with [ERROR] prefix', () => {
      logger.error('boom');
      expect(errorSpy).toHaveBeenCalledWith('[ERROR]', 'boom');
    });

    it('warn → console.warn with [WARN] prefix', () => {
      logger.warn('careful');
      expect(warnSpy).toHaveBeenCalledWith('[WARN]', 'careful');
    });

    it('info → console.info with [INFO] prefix', () => {
      logger.info('hello');
      expect(infoSpy).toHaveBeenCalledWith('[INFO]', 'hello');
    });

    it('debug is suppressed', () => {
      logger.debug('verbose');
      expect(logSpy).not.toHaveBeenCalled();
    });

    it('forwards multiple arguments to the underlying console method', () => {
      const err = new Error('boom');
      logger.error('failed:', err, { extra: true });
      expect(errorSpy).toHaveBeenCalledWith('[ERROR]', 'failed:', err, { extra: true });
    });
  });

  describe('LOG_LEVEL=error', () => {
    let logger;
    beforeEach(async () => {
      logger = await loadLogger('error');
    });

    it('logs error', () => {
      logger.error('a');
      expect(errorSpy).toHaveBeenCalledTimes(1);
    });

    it('suppresses warn, info and debug', () => {
      logger.warn('b');
      logger.info('c');
      logger.debug('d');
      expect(warnSpy).not.toHaveBeenCalled();
      expect(infoSpy).not.toHaveBeenCalled();
      expect(logSpy).not.toHaveBeenCalled();
    });
  });

  describe('LOG_LEVEL=debug', () => {
    let logger;
    beforeEach(async () => {
      logger = await loadLogger('debug');
    });

    it('debug → console.log with [DEBUG] prefix (not console.debug)', () => {
      logger.debug('verbose');
      expect(logSpy).toHaveBeenCalledWith('[DEBUG]', 'verbose');
    });

    it('logs all levels at debug', () => {
      logger.error('e');
      logger.warn('w');
      logger.info('i');
      logger.debug('d');
      expect(errorSpy).toHaveBeenCalledTimes(1);
      expect(warnSpy).toHaveBeenCalledTimes(1);
      expect(infoSpy).toHaveBeenCalledTimes(1);
      expect(logSpy).toHaveBeenCalledTimes(1);
    });
  });

  describe('invalid LOG_LEVEL', () => {
    let logger;
    beforeEach(async () => {
      logger = await loadLogger('SUPERVERBOSE');
    });

    it('falls back to info: info logs, debug is suppressed', () => {
      logger.info('hi');
      logger.debug('verbose');
      expect(infoSpy).toHaveBeenCalledWith('[INFO]', 'hi');
      expect(logSpy).not.toHaveBeenCalled();
    });
  });
});
