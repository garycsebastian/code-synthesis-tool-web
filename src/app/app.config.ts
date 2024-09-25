import {ApplicationConfig, provideZoneChangeDetection, importProvidersFrom} from '@angular/core';
import {provideRouter} from '@angular/router';

import {provideHttpClient, withInterceptorsFromDi, HTTP_INTERCEPTORS} from '@angular/common/http'; // Import HttpClientModule

import {routes} from './app.routes';
import {AuthInterceptorService} from "./interceptors/auth-interceptor.service";
import { BrowserAnimationsModule } from '@angular/platform-browser/animations'; // For PrimeNG animations
import {provideAnimationsAsync} from "@angular/platform-browser/animations/async";

export const appConfig: ApplicationConfig = {
  providers: [provideZoneChangeDetection({eventCoalescing: true}), provideRouter(routes),
    provideHttpClient(withInterceptorsFromDi()),
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptorService, multi: true },
    provideAnimationsAsync(),
    // Import PrimeNG modules globally
    importProvidersFrom(
      BrowserAnimationsModule,
      // ... other PrimeNG modules you need
    )
  ]
};
