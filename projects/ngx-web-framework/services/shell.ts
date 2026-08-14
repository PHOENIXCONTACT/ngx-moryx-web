import { SearchRequestCallback, SearchSuggestion } from './search-bar/search-bar.service';

export interface MoryxShell {
  initSearchBar(callback: SearchRequestCallback, disableSearchBox: boolean): void;

  updateSuggestions(suggestions: SearchSuggestion[]): void;

  // TODO: Rename to getCurrentLang() in the next major
  initLanguage(): string;
}
