import { inject, LOCALE_ID, makeEnvironmentProviders } from '@angular/core';
import { LanguageService } from './language.service';

/**
 * Provides the Angular LOCALE_ID based on the current culture selected by LanguageService.
 * This ensures that built-in pipes (date, number, currency, etc.) format values
 * according to the user's selected language.
 */
export function provideAngularLocale() {
  return makeEnvironmentProviders([
    {
      provide: LOCALE_ID,
      useFactory: () => {
        const languageService = inject(LanguageService);
        return languageService.getFallbackLang();
      },
    },
  ]);
}
