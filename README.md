# MORYX - Web

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 13.2.5.

## How to use the npm packages
1. Add a **.npmrc** file to the project
```
registry=https://registry.npmjs.org
@moryx:registry=https://packages-ctvc.europe.phoenixcontact.com/npm/moryx-npm/
```
2. Turn ssl off with `npm config set strict-ssl false`
3. Install the package with `npm install @moryx/ngx-web-framework`
4. Turn back on ssl with `npm config set strict-ssl true`

## Components
### Navigable Entry Editor
The Navigable Entry Editor is a is an entry editor with breadcrumbs on top. You can navigate to lists and other objects in the entry. </br>
It has the following parameters
- **entry** contains the base entry
- **disabled** disables all fields of the entry editor  
- **queryParam** is the name of the query parameter in which the entry path is saved in order to navigate to a specific subentry on reloading (optional)
``` html
<navigable-entry-editor [entry]="entry" [disabled]="disabled" queryParam="entryEditor1"></navigable-entry-editor>
```

## Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.

## Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory.

## Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Running end-to-end tests

Run `ng e2e` to execute the end-to-end tests via a platform of your choice. To use this command, you need to first add a package that implements end-to-end testing capabilities.

## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI Overview and Command Reference](https://angular.io/cli) page.
