import { SearchSuggestion } from './search-bar/search-bar.service';

export interface MoryxShell {
    initSearchBar(callback: SearchRequestCallback, disableSearchBox: boolean): void;
    updateSuggestions(suggestions: SearchSuggestion[]): void;
    onLanguageChange(callback: any): string;
}

interface SearchRequestCallback {
    (term: string, complete: boolean): void;
}
