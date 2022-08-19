import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class SearchBarService {
  constructor() {}

  searchFilter(): Observable<SearchResult> {
    return new Observable(subscriber => {
      shell.onsearch((value: string, completed: boolean) => {
        subscriber.next(<SearchResult>{ value: value, completed: completed });

        if (completed) {
          subscriber.complete();
        }

        return () => shell.onsearch(() => {});
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
