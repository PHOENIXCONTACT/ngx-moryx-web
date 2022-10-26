# MORYX Identity and Access Management
This library provides a module handling the communication to the MORYX Identity Management server.
It contains the required API definitions generated with ng-openapi-gen.
In addition to that it defines a directive to mark DOM elements to be conditionally visible, based on whether the IAM confirms a given permission to be available for the loged in user.
*(Note: A service to login from angular is not provided yet)*

## Including the directive in your angular app
To make use of the provided directive, we currently need to prepare the app.module file.
First add the `AuthModule` to the imports and configure the url under which the MORYX Identity Server is hosted.
```ts
imports: [
    AuthModule.forRoot({ rootUrl: "https://localhost:5001" }),
    ...
  ],
```
Besides that, we also need to add the `AuthInterceptor` as well as its provider to the providers array in the app.module
```ts
  providers: [AuthInterceptor, AUTH_INTERCEPTOR_PROVIDER],
```

Great, now you have everything set up to use the MORYX permission directive as you please
```ts
<button *moryxIfHasPermission="'Moryx.Products.CanImport'; except ignoreIam">
    WHAT A FEATURE!
</button>
```

Making the `ignoreIam` an environment variable allows you to continue developing the UI using `ng serve` without a running IAM.