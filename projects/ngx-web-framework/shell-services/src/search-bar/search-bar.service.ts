import { Injectable, NgZone } from '@angular/core';
import { Observable, Observer, Subscription } from 'rxjs';
import { MoryxShell } from '../shell';

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

export interface SearchSuggestion {
  text: string;
  url?: string;
}

declare global {
  interface Window { shell: MoryxShell;}
}

export interface SearchRequestCallback {
  (term: string, complete: boolean): void;
}