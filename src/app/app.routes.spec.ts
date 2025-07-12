import { Routes } from '@angular/router';
import { routes } from './app.routes';

describe('routes', () => {
  it('should initialize as an empty Routes array', () => {
    expect(routes).toBeDefined();
    expect(Array.isArray(routes)).toBeTrue();
    expect(routes.length).toBe(0);
  });
});
