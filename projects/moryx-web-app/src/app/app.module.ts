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
import { environment } from '../environments/environment';
import { HttpClient, provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';

export function httpTranslateLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http, environment.assets + 'assets/languages/');
}

@NgModule({ 
    declarations: 
    [AppComponent, EmptyStateDemoComponent, OverviewComponent, SnackbarDemoComponent],
    bootstrap: [AppComponent],
     imports: [
        BrowserModule,
        AppRoutingModule,
        BrowserAnimationsModule,
        MatSnackBarModule,
        MatButtonModule,
        MatDividerModule,
        EmptyStateModule,
        TranslateModule.forRoot({
            loader: {
                provide: TranslateLoader,
                useFactory: httpTranslateLoaderFactory,
                deps: [HttpClient],
            },
        })
    ],
         providers: [provideHttpClient(withInterceptorsFromDi())] })
export class AppModule { }
