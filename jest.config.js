export default {
  testEnvironment: 'node',
  transform: {},
  extensionsToTreatAsEsm: [],
  testMatch: ['**/tests/**/*.test.js'],
  collectCoverageFrom: [
    'src/**/*.js',
    '!src/server.js',
    '!src/shared/infrastructure/database/mongoose.connection.js'
  ],
  coverageThreshold: {
    global: {
      lines: 80
    }
  },
  coverageReporters: ['text', 'lcov']
};
