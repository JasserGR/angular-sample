import { provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { appConfig } from './app.config';
import { routes } from './app.routes';

describe('appConfig', () => {
  it('should create an ApplicationConfig with correct providers', () => {
    expect(appConfig).toBeDefined();
    expect(appConfig.providers).toBeDefined();
    expect(appConfig.providers.length).toBe(2);
    const [zoneProvider, routerProvider] = appConfig.providers;
    // Check if providers are functions (Angular providers)
    expect(zoneProvider).toBe(provideZoneChangeDetection({ eventCoalescing: true }));
    expect(routerProvider).toBe(provideRouter(routes));
    expect(routes).toBeDefined(); // Ensure routes is used
  });
});
