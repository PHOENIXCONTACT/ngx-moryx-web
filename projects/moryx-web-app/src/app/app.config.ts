import { provideRouter, Routes } from '@angular/router';
import { EmptyStateDemoComponent } from './empty-state-demo/empty-state-demo.component';
import { EntryEditorDemoComponent } from './entry-editor-demo/entry-editor-demo.component';
import { SnackbarDemoComponent } from './snackbar-demo/snackbar-demo.component';
import { OverviewComponent } from './overview/overview.component';
import { ApplicationConfig, importProvidersFrom } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { HttpClient, provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { environment } from '../environments/environment';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
const routes: Routes = [
  { path: 'entry-editor', component: EntryEditorDemoComponent },
  { path: 'empty-state', component: EmptyStateDemoComponent },
  { path: 'snackbar', component: SnackbarDemoComponent },
  { path: '', component: OverviewComponent },
];
export function httpTranslateLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http, environment.assets + 'assets/languages/');
}
export const appConfig: ApplicationConfig = {
  providers: [
    provideHttpClient(),
    provideRouter(routes),
    importProvidersFrom(
      BrowserModule,
      MatSnackBarModule,
      TranslateModule,
      MatButtonModule,
      MatDividerModule,
      TranslateModule.forRoot({
        loader: {
          provide: TranslateLoader,
          useFactory: httpTranslateLoaderFactory,
          deps: [HttpClient],
        },
      })
    ),
    provideAnimations(),
    provideHttpClient(withInterceptorsFromDi()),
    provideAnimationsAsync(),
  ],
};
