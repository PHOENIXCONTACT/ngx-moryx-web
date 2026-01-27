# NpxMoryxWeb

This project was generated using [Angular CLI](https://github.com/angular/angular-cli) version 21.1.0.

## How to use the npm packages

1. Add a **.npmrc** file to the project
```
registry=https://registry.npmjs.org
@moryx:registry=https://www.myget.org/F/moryx-ci/auth/4cd70c3b-c8e8-4186-8c35-3d4c8789bbdd/npm
```
2. Install the package with `npm install @moryx/ngx-web-framework`

It is intended that releases of this package live on the `moryx-ci` feed
because it's an internal package which is not distributed publicly.

## Components

### Navigable Entry Editor

The Navigable Entry Editor is a is an entry editor with breadcrumbs on top. You can navigate to lists and other objects in the entry. </br>
It has the following parameters:

- **entry** contains the base entry
- **disabled** disables all fields of the entry editor
- **queryParam** is the name of the query parameter in which the entry path is saved in order to navigate to a specific subentry on reloading (optional)

``` html
<navigable-entry-editor [entry]="entry" [disabled]="disabled" queryParam="entryEditor1"></navigable-entry-editor>
```

### Empty State Component

The empty state component provides a styled screen to show the user when no content is available to be shown.
As a reference for your decision when to use this screen take a look at the respective [design guidline](https://material.io/design/communication/empty-states.html#content).
The following parameters are available:

- **header** The header shown on the page
- **message** The messaage shown on the page
- **icon** The icon shown on the page. We recommend the `rocket_launch` icon for screens that get active if the user does something and the `bedtime` icon for screnns that are inactive if everything is in order. For more icons take a look [here](https://fonts.google.com/icons?selected=Material+Icons&icon.set=Material+Symbols)

``` html
<empty-state [header]="'Nothing to show'" [message]="'We can´t show you anything here.'" icon="bedtime"></empty-state>
```

## Development server

To start a local development server, run:

```bash
ng serve
```

Once the server is running, open your browser and navigate to `http://localhost:4200/`. The application will automatically reload whenever you modify any of the source files.

## Code scaffolding

Angular CLI includes powerful code scaffolding tools. To generate a new component, run:

```bash
ng generate component component-name
```

For a complete list of available schematics (such as `components`, `directives`, or `pipes`), run:

```bash
ng generate --help
```

## Building

To build the project run:

```bash
ng build
```

This will compile your project and store the build artifacts in the `dist/` directory. By default, the production build optimizes your application for performance and speed.

## Running unit tests

To execute unit tests with the [Vitest](https://vitest.dev/) test runner, use the following command:

```bash
ng test
```

## Additional Resources

For more information on using the Angular CLI, including detailed command references, visit the [Angular CLI Overview and Command Reference](https://angular.dev/tools/cli) page.
