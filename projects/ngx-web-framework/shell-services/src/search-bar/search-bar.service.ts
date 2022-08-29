import { Injectable, NgZone } from '@angular/core';
import { Observable, Observer, Subscription } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class SearchBarService {
  subscription: Subscription | undefined = undefined;

  constructor(private ngZone: NgZone) { }

  subscribe(observer: Partial<Observer<SearchRequest>> | undefined): void {
    if(this.subscription !== undefined) {
      this.subscription.unsubscribe();
    }
    
    let observable = new Observable<SearchRequest>(subscriber => {
      window.shell.initSearchBar((term: string, submitted: boolean) => {
        this.ngZone.run(() => { subscriber.next(<SearchRequest>{ term: term, submitted: submitted }) });

        if (submitted) {
          this.ngZone.run(() => { subscriber.complete() });
        }
      },
      false);
    });

    this.subscription = observable.subscribe(observer);
  }

  unsubscribe(): void {
    if(this.subscription !== undefined) {
      window.shell.initSearchBar(() => {}, true);
      this.subscription.unsubscribe();
    }
  }

  provideSuggestions(suggestions: SearchSuggestion[]) {
    window.shell.updateSuggestions(suggestions);
  }

  clearSuggestions() {
    window.shell.updateSuggestions([]);
  }
}

export interface SearchRequest {
  term: string;
  submitted: boolean;
}

interface SearchRequestCallback {
  (term: string, complete: boolean): void;
}

export interface SearchSuggestion {
  text: string;
  url?: string;
}

interface MoryxShell {
  initSearchBar(callback: SearchRequestCallback, disableSearchBox: boolean): void;
  updateSuggestions(suggestions: SearchSuggestion[]): void;
}

declare global {
  interface Window { shell: MoryxShell;}
}