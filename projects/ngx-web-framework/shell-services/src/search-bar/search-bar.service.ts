import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class SearchBarService {
  constructor() {}

  searchFilter(): Observable<SearchResult> {
    return new Observable(subscriber => {
      shell.onSearch((value: string, completed: boolean) => {
        subscriber.next(<SearchResult>{ value: value, completed: completed });

        if (completed) {
          subscriber.complete();
        }

        return () => shell.onSearch(() => {});
      });
    });
  }

  updateSuggestions(suggestions: SearchSuggestion[]) {
    shell.updateSuggestions(suggestions);
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

declare var shell: MoryxShell;