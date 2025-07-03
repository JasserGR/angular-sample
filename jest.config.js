module.exports = {
  preset: 'jest-preset-angular',
  setupFilesAfterEnv: ['<rootDir>/setup-jest.ts'],
  
  // Coverage configuration
  collectCoverage: true,
  coverageDirectory: 'coverage',
  coverageReporters: ['lcov', 'html', 'text-summary', 'cobertura'],
  
  // What files to include in coverage
  collectCoverageFrom: [
    'src/**/*.ts',
    '!src/main.ts',
    '!src/polyfills.ts',
    '!src/**/*.spec.ts',
    '!src/**/*.module.ts',
    '!src/environments/**',
    '!src/test.ts'
  ],
  
  // Coverage thresholds (optional but recommended)
  coverageThreshold: {
    global: {
      branches: 40,
      functions: 40,
      lines: 40,
      statements: 40
    }
  },
  
  // Test environment
  testEnvironment: 'jsdom',
  
  // Module resolution
  moduleNameMapping: {
    '@/(.*)': '<rootDir>/src/$1'
  },
  
  // Transform files
  transform: {
    '^.+\\.(ts|js|html)$': 'jest-preset-angular'
  },
  
  // Test match patterns
  testMatch: [
    '<rootDir>/src/**/*.spec.ts'
  ],
  
  // Mock static assets
  moduleNameMapping: {
    '\\.(jpg|jpeg|png|gif|svg)$': 'identity-obj-proxy',
    '\\.(css|less|scss)$': 'identity-obj-proxy'
  },
  
  // Reporters for CI/CD
  reporters: [
    'default',
    ['jest-junit', {
      outputDirectory: 'test-results',
      outputName: 'results.xml'
    }]
  ],
  
  // Performance
  maxWorkers: '50%',
  
  // Timeout
  testTimeout: 10000
};