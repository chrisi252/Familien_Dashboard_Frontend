import { APP_INITIALIZER, ApplicationConfig, inject, LOCALE_ID, provideBrowserGlobalErrorListeners } from '@angular/core';
import { registerLocaleData } from '@angular/common';
import localeDe from '@angular/common/locales/de';
import { provideRouter } from '@angular/router';

registerLocaleData(localeDe);
import { provideIcons } from '@ng-icons/core';
import {
  heroCog6Tooth,
  heroTrash,
  heroChevronLeft,
  heroChevronRight,
  heroChevronUp,
  heroChevronDown,
  heroArrowsRightLeft
} from '@ng-icons/heroicons/outline';

import { routes } from './app.routes';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { authorizeInterceptor } from './authorize-interceptor';
import { UserStateService } from './services/user-state-service';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes),
    provideIcons({
      heroCog6Tooth,
      heroTrash,
      heroChevronLeft,
      heroChevronRight,
      heroChevronUp,
      heroChevronDown,
      heroArrowsRightLeft
    }),
    { provide: LOCALE_ID, useValue: 'de' },
    provideHttpClient(withInterceptors([authorizeInterceptor])),
    {
      provide: APP_INITIALIZER,
      multi: true,
      useFactory: () => {
        const userState = inject(UserStateService);
        return () => userState.initializeSession();
      },
    },

  ]
};
