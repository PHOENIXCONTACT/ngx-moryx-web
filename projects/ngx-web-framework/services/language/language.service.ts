import { Injectable } from '@angular/core';
import { MoryxShell } from '../shell';

// TODO: Move to locales entry-point in the next major

@Injectable({
  providedIn: 'root',
})
export class LanguageService {
  getCurrentLang(): string {
    if (window.shell) {
      return window.shell.initLanguage();
    }
    return 'de';
  }

  /** @deprecated Use {@link getCurrentLang} instead. Will be removed in the next major version. */
  getFallbackLang(): string {
    return this.getCurrentLang();
  }
}

declare global {
  interface Window {
    shell: MoryxShell;
  }
}
