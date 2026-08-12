import { inject, LOCALE_ID, makeEnvironmentProviders, provideAppInitializer } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { LanguageService } from '@moryx/ngx-web-framework/services';

/**
 * Configures Angular's built-in locale and ngx-translate for the application.
 *
 * - Sets `LOCALE_ID` so built-in pipes (date, number, currency, etc.) format values
 *   according to the user's selected language.
 * - Registers the provided languages with ngx-translate, sets 'en' as fallback,
 *   and activates the user's language (falling back to 'en' if unsupported).
 *
 * Note: Locale data must still be registered at the project level via
 * `import '@angular/common/locales/global/<lang>'` side-effect imports.
 *
 * @param languages All supported language codes (e.g. ['en', 'de', 'it', 'zh']).
 * @param fallbackLang The default language to use when the user's language is not supported (default: 'en').
 */
export function provideMoryxLocalization(languages: string[], fallbackLang: string = 'en') {
  if (!languages.includes(fallbackLang)) {
    throw new Error(`provideMoryxLocalization: fallbackLang '${fallbackLang}' must be included ` +
      `in the languages array [${languages.join(', ')}].`);
  }

  return makeEnvironmentProviders([
    {
      provide: LOCALE_ID,
      useFactory: () => {
        const lang = inject(LanguageService).getCurrentLang();
        return languages.includes(lang) ? lang : fallbackLang;
      },
    },
    provideAppInitializer(() => {
      const translateService = inject(TranslateService);
      const languageService = inject(LanguageService);

      translateService.addLangs(languages);
      translateService.setFallbackLang(fallbackLang);

      const lang = languageService.getCurrentLang();
      if (!languages.includes(lang)) {
        console.warn(`Language '${lang}' is not supported. Falling back to '${fallbackLang}'.`);
      }
      translateService.use(languages.includes(lang) ? lang : fallbackLang);
    }),
  ]);
}
