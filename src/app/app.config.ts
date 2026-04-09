import { APP_INITIALIZER, ApplicationConfig, inject, provideBrowserGlobalErrorListeners } from '@angular/core';
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
      heroArrowsRightLeft
    }),
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
