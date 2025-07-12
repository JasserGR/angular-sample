import { provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { appConfig } from './app.config';
import { routes } from './app.routes';

describe('appConfig', () => {
  it('should create an ApplicationConfig with correct providers', () => {
    expect(appConfig).toBeDefined();
    expect(appConfig.providers).toBeDefined();
    expect(appConfig.providers.length).toBe(2);
    expect(appConfig.providers[0]).toEqual(provideZoneChangeDetection({ eventCoalescing: true }));
    expect(appConfig.providers[1]).toEqual(provideRouter(routes));

  });
});
