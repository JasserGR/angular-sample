process.env.NODE_OPTIONS = '--no-experimental-fetch';
module.exports = {
  preset: 'jest-preset-angular',
  setupFilesAfterEnv: ['<rootDir>/src/setup-jest.ts'],
  testMatch: ['**/+(*.)+(spec|test).ts'],
  coverageDirectory: 'coverage/angular-sample',
  coverageReporters: ['lcov', 'text-summary'],
  collectCoverage: true,
  coverageThreshold: {
    global: {
      branches: 80,
      functions: 80,
      lines: 80,
      statements: 80,
    },
  },
};