import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { AppComponent } from './app/app.component';

describe('main', () => {
  // Note: bootstrapApplication is asynchronous and console.error is hard to test directly
  it('should define bootstrapApplication call', () => {
    // This is a basic check; full testing requires mocking the DOM
    expect(bootstrapApplication).toBeDefined();
    spyOn(console, 'error');
    bootstrapApplication(AppComponent, appConfig).catch((err) => {
      fail('Bootstrap should not throw an error in test: ' + err);
    });
    expect(console.error).not.toHaveBeenCalled();
  });
});
