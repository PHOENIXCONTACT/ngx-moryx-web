import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Injectable, NgModule } from '@angular/core';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { LanguageService } from '../..';
import { MoryxSnackbarService } from './moryx-snackbar/moryx-snackbar.service';

export function httpTranslateLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http, './languages/');
}

@NgModule({
  declarations: [MoryxSnackbarService],
  imports: [
    CommonModule,
    MatSnackBarModule,
    LanguageService,
    Injectable,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: httpTranslateLoaderFactory,
        deps: [HttpClient],
      },
    }),
  ],
  exports: [MoryxSnackbarService],
})
export class MoryxSnackbarModule {}
