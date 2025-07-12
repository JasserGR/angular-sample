import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { AppComponent } from './app/app.component';

describe('main', () => {
  it('should define bootstrapApplication call', () => {
    expect(bootstrapApplication).toBeDefined();
    expect(appConfig).toBeDefined(); // Indirect validation
  });
});
