interface SearchCallback {
  (filter: string, complete: boolean): void;
}

interface SearchSuggestion {
  text: string;
  url?: string;
}

interface MoryxShell {
  onsearch(callback: SearchCallback): void;
  updateSuggestions(suggestions: SearchSuggestion[]): void;
}

declare var shell: MoryxShell;
