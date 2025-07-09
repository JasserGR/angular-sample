import 'zone.js';
import 'zone.js/testing';

import { getTestBed } from '@angular/core/testing';
import {
  BrowserDynamicTestingModule,
  platformBrowserDynamicTesting
} from '@angular/platform-browser-dynamic/testing';

// Init test environment
getTestBed().initTestEnvironment(
  BrowserDynamicTestingModule,
  platformBrowserDynamicTesting()
);

// Vite-based / esbuild-based bundler workaround: use `import.meta.glob` to load tests

const testModules = import.meta.glob('./**/*.spec.ts', { eager: true });

// No need to manually iterate keys — import.meta.glob with eager loads all

// Optional: If you want to log loaded tests for debug
console.log('Loaded test modules:', Object.keys(testModules));

