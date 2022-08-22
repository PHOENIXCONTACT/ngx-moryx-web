import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class SearchBarService {
  constructor() {}

  searchFilter(): Observable<SearchResult> {
    return new Observable(subscriber => {
      window.shell.onSearch((value: string, completed: boolean) => {
        subscriber.next(<SearchResult>{ value: value, completed: completed });

        if (completed) {
          subscriber.complete();
        }

        return () => window.shell.onSearch(() => {});
      });
    });
  }

  updateSuggestions(suggestions: SearchSuggestion[]) {
    window.shell.updateSuggestions(suggestions);
  }
}

export interface SearchResult {
  value: string;
  completed: boolean;
}

interface SearchCallback {
  (filter: string, complete: boolean): void;
}

export interface SearchSuggestion {
  text: string;
  url?: string;
}

interface MoryxShell {
  onSearch(callback: SearchCallback): void;
  updateSuggestions(suggestions: SearchSuggestion[]): void;
}

declare global {
  interface Window { shell: MoryxShell;}
}