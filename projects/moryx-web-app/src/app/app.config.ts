import { provideRouter, Routes } from '@angular/router';
import { EmptyStateDemoComponent } from './empty-state-demo/empty-state-demo.component';
import { EntryEditorDemoComponent } from './entry-editor-demo/entry-editor-demo.component';
import { SnackbarDemoComponent } from './snackbar-demo/snackbar-demo.component';
import { OverviewComponent } from './overview/overview.component';
import { ApplicationConfig, importProvidersFrom } from '@angular/core';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { provideTranslateService, provideTranslateLoader } from '@ngx-translate/core';
import { provideTranslateHttpLoader } from '@ngx-translate/http-loader';
import { environment } from '../environments/environment';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';

const routes: Routes = [
  { path: 'entry-editor', component: EntryEditorDemoComponent },
  { path: 'empty-state', component: EmptyStateDemoComponent },
  { path: 'snackbar', component: SnackbarDemoComponent },
  { path: '', component: OverviewComponent }
];
export const appConfig: ApplicationConfig = {
  providers: [
    provideHttpClient(withInterceptorsFromDi()),
    provideRouter(routes),
    importProvidersFrom(
      MatSnackBarModule,
      MatButtonModule,
      MatDividerModule
    ),
    provideAnimationsAsync(),
    provideTranslateService({
      loader: provideTranslateHttpLoader({
        prefix: environment.assets + 'assets/languages/',
        suffix: '.json'
      }),
      fallbackLang: 'en'
    })
  ]
};
