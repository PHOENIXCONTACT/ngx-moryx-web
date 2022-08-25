import { Injectable, NgZone } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class SearchBarService {
  constructor(private ngZone: NgZone) {}

  searchFilter(): Observable<SearchResult> {
    return new Observable(subscriber => {
      window.shell.onsearch((value: string, completed: boolean) => {
        this.ngZone.run (()=> {subscriber.next(<SearchResult>{ value: value, completed: completed })});

        if (completed) {
          this.ngZone.run (()=>{subscriber.complete()}) 
        }

        this.ngZone.run (()=>{return () => this.ngZone.run(() => { window.shell.onsearch(() => { }) })});
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
  onsearch(callback: SearchCallback): void;
  updateSuggestions(suggestions: SearchSuggestion[]): void;
}

declare global {
  interface Window { shell: MoryxShell;}
}