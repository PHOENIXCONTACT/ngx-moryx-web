import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideRouter } from '@angular/router';

import { provideMoryxMaterialDefaults } from '@moryx/ngx-web-framework/material';
import { provideMoryxLocalization } from '@moryx/ngx-web-framework/i18n';

import { routes } from './app.routes';
import { provideHttpClient } from '@angular/common/http';
import { provideTranslateService } from '@ngx-translate/core';

export const appConfig: ApplicationConfig = {
  providers: [
    provideMoryxMaterialDefaults(),
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes),
    provideHttpClient(),
    provideTranslateService(),
    provideMoryxLocalization(['en', 'de', 'it', 'zh']),
  ]
};
