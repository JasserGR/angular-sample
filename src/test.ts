import 'zone.js'; 
import 'zone.js/testing';

import { getTestBed } from '@angular/core/testing';
import {
  BrowserDynamicTestingModule,
  platformBrowserDynamicTesting
} from '@angular/platform-browser-dynamic/testing';


declare const require: any;

getTestBed().initTestEnvironment(
  BrowserDynamicTestingModule,
  platformBrowserDynamicTesting()
);

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const context = require.context('./', true, /\.spec\.ts$/);
context.keys().forEach(context);

