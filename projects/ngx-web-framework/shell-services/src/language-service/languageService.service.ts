import { Injectable } from '@angular/core';
import { MoryxShell } from '../shell';

@Injectable({
  providedIn: 'root',
})
export class LanguageService {
  constructor() {}

  subscribe(callback: any): void {
    window.shell.onLanguageChange(callback);
  }
}

declare global {
  interface Window {
    shell: MoryxShell;
  }
}
