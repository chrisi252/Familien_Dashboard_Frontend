import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideIcons } from '@ng-icons/core';
import {
  heroCog6Tooth,
  heroTrash,
  heroChevronLeft,
  heroChevronRight,
  heroArrowsRightLeft
} from '@ng-icons/heroicons/outline';

import { routes } from './app.routes';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { authorizeInterceptor } from './authorize-interceptor';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes),
    provideIcons({
      heroCog6Tooth,
      heroTrash,
      heroChevronLeft,
      heroChevronRight,
      heroArrowsRightLeft
    }),
    provideHttpClient(withInterceptors([authorizeInterceptor])),

  ]
};
