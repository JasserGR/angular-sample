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
    expect(zoneProvider).toEqual(jasmine.objectContaining({ useFactory: provideZoneChangeDetection, multi: true }));
    expect(routerProvider).toEqual(jasmine.objectContaining({ useFactory: provideRouter, multi: true }));
    expect(routes).toBeDefined(); 
  });
});
