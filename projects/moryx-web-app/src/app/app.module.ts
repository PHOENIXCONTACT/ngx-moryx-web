import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { EmptyStateModule } from '@moryx/ngx-web-framework/empty-state';
import { EntryEditorModule } from '@moryx/ngx-web-framework/entry-editor';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { EmptyStateDemoComponent } from './empty-state-demo/empty-state-demo.component';
import { EntryEditorDemoComponent } from './entry-editor-demo/entry-editor-demo.component';
import { OverviewComponent } from './overview/overview.component';
import { SnackbarDemoComponent } from './snackbar-demo/snackbar-demo.component';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { HttpClient, HttpClientModule } from '@angular/common/http';

export function httpTranslateLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http);
}

@NgModule({
  declarations: [AppComponent, EntryEditorDemoComponent, EmptyStateDemoComponent, OverviewComponent, SnackbarDemoComponent],
  imports: [
    BrowserModule,
    HttpClientModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MatSnackBarModule,
    MatButtonModule,
    MatDividerModule,
    EntryEditorModule,
    EmptyStateModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: httpTranslateLoaderFactory,
        deps: [HttpClient],
      },
    }),

  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
