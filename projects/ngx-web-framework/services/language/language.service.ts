import { Injectable } from '@angular/core';
import { MoryxShell } from '../shell';

@Injectable({
  providedIn: 'root',
})
export class LanguageService {
  getFallbackLang(): string {
    if (window.shell) {
      return window.shell.initLanguage();
    }
    return 'de';
  }
}

declare global {
  interface Window {
    shell: MoryxShell;
  }
}
