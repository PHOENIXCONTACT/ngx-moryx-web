# SearchBarService 

The `SearchBarService` is meant to let your components interact with the `Moryx.WebShell` search bar:

* React to search bar inputs
* Provide the user with suggestions

## Reference

This section explains the services functions. You will find a small example at the end of this document.

### `subscribe()`

First of all, you will most likely want to subscribe for search bar inputs. 
This is very straightforward and may be done inside the components `ngOnInit()`:

```ts
  ngOnInit(): void {
    this.searchbar.subscribe({
      next: (request: SearchRequest) => { /* react to inputs */ },
      complete: () => { /* */},
    });
  }
```

Having this, you will be notified for any inputs made to the search bar and can then process the search request, the way you want.

`subscribe()` will also 'enable' the search bar visually.

### `unsubscribe()`

If your app consists of multiple different components, there is a chance, that not all of them should react to inputs, or you want to disable the search bar for any reason.

Doing so when leaving a component is a quite common use case:

```ts
  ngOnDestroy(): void {
    this.searchbar.unsubscribe();
  }
```

This will not only stop the service from listening to search bar input, it will also reset and disable the search bar to prevent users from using it

### `provideSuggestions()`

When a user enters text to the search bar, you might want to provide her with suggestions that will be displayed in a list beneath the input field. 

You will find how to use it in an example below.

#### Parameters

`suggestions: SearchSuggestion[]` - List of `SearchSuggestion`s

### `clearSuggestions()`

`clearSuggestions()` will remove all suggestions from the search bar

## Example


```ts
  // ...
  constructor(private searchbar: SearchBarService) { }

  ngOnInit(): void {
    // subscribe for search bar inputs (activates the search bar)
    this.searchbar.subscribe({
      next: (request: SearchRequest) => this.onSearchRequest(result),
    });
  }

  ngOnDestroy(): void {
    // unsubscribe from search bar inputs (disables the search bar)
    this.searchbar.unsubscribe();
  }

  onSearchRequest(searchRequest: SearchRequest): void {
    if(searchRequest.submitted) {
      // do anything with the `search.term`
      // for example show a list of matching items

      // clear the suggestions after the search request has
      // been submitted
      this.searchbar.clearSuggestions();
    } else {
      // Unless the search was submitted, the user should be
      // provided with some suggestions
      let suggestions = gatherSuggestions(searchRequest.term);

      this.searchbar.provideSuggestions(suggestions);
    }
  }

  gatherSuggestions(searchTerm: string): SearchSuggestion[] {
    // ...
  }

```