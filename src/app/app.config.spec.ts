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


    expect(zoneProvider).toBeDefined();
    const zoneConfig = provideZoneChangeDetection({ eventCoalescing: true });
    expect(zoneProvider).toEqual(jasmine.objectContaining({
      provide: jasmine.any(Object), 
      useValue: true, 
    }));


    expect(routerProvider).toBeDefined();
    const routerConfig = provideRouter(routes);
    expect(routerProvider).toEqual(jasmine.objectContaining({
      provide: jasmine.any(Object), 
      useFactory: jasmine.any(Function), 
    }));

    expect(routes).toBeDefined(); 
  });
});
