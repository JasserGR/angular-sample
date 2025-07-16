const path = require('path');
module.exports = function (config) {
  config.set({
    basePath: '',
    frameworks: ['jasmine', '@angular-devkit/build-angular'],
    plugins: [
      require('karma-jasmine'),
      require('karma-chrome-launcher'),
      require('karma-coverage'),
      require('karma-jasmine-html-reporter'),
      require('karma-junit-reporter'),
      require('@angular-devkit/build-angular/plugins/karma')
    ],
    client: {
      jasmine: {},
      clearContext: false
    },
    jasmineHtmlReporter: {
      suppressAll: true
    },
    coverageReporter: {
      dir: 'coverage/angular-sample',
      subdir: '.',
      reporters: [
        { type: 'lcovonly' },
        { type: 'html' },
        { type: 'text-summary' }
      ]
    },
    reporters: ['progress', 'kjhtml', 'junit', 'coverage'],
    junitReporter: {
      outputDir: 'test-results',
      outputFile: 'results.xml',
      useBrowserName: false
    },
    port: 9876,
    colors: true,
    logLevel: config.LOG_INFO,
    autoWatch: false,
    browsers: ['ChromeHeadlessNoSandbox'],
    singleRun: true,
    restartOnFileChange: false,
    customLaunchers: {
      ChromeHeadlessNoSandbox: {
        base: 'ChromeHeadless',
        flags: ['--no-sandbox', '--disable-gpu']
      }
    }
    browsers: ['ChromeHeadlessCustom'],
    captureTimeout: 120000, 
    browserDisconnectTimeout: 10000, 
    browserNoActivityTimeout: 60000,
    singleRun: true,
    restartOnFileChange: true
  });
};
