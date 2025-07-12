import { Routes } from '@angular/router';
import { routes } from './app.routes';

describe('routes', () => {
  it('should initialize as an empty Routes array', () => {
    const emptyRoutes: Routes = []; 
    expect(routes).toBeDefined();
    expect(Array.isArray(routes)).toBeTrue();
    expect(routes.length).toBe(0);
    expect(routes).toEqual(emptyRoutes); 
  });
});
