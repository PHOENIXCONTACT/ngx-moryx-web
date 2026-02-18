import { HttpErrorResponse } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { lastValueFrom } from 'rxjs';
import { TranslationConstants } from './translation-constants';
import { LanguageService } from '../language/language.service';
import { TranslateService } from '@ngx-translate/core';

@Injectable({
  providedIn: 'root',
})
export class SnackbarService {
  private snackbar = inject(MatSnackBar);
  private languageService = inject(LanguageService);
  private translate = inject(TranslateService);

  constructor() {
    this.translate.addLangs([
      TranslationConstants.LANGUAGES.EN,
      TranslationConstants.LANGUAGES.DE,
      TranslationConstants.LANGUAGES.IT,
    ]);
    this.translate.setDefaultLang(this.languageService.getDefaultLanguage());
  }

  async showError(errorMessage: string) {
    let msg!: string;
    if (errorMessage && errorMessage.length > 0) {
      msg = errorMessage;
    } else {
      msg = await lastValueFrom(this.translate.get(TranslationConstants.DEFAULT_MESSAGE));
    }
    const dismissMessage = await lastValueFrom(this.translate.get(TranslationConstants.DISMISS));

    this.snackbar.open(msg, dismissMessage, {
      duration: 5000,
      panelClass: 'danger',
    });
  }

  async showSuccess(errorMessage: string) {
    let msg!: string;
    if (errorMessage && errorMessage.length > 0) {
      msg = errorMessage;
    } else {
      msg = await lastValueFrom(this.translate.get(TranslationConstants.SUCCESS));
    }
    const dismissMessage = await lastValueFrom(this.translate.get(TranslationConstants.DISMISS));

    this.snackbar.open(msg, dismissMessage, {
      duration: 5000,
      panelClass: 'success',
    });
  }

  async handleError(e: HttpErrorResponse) {
    if (e.status === 0) {
      const not_reachable_msg = await lastValueFrom(this.translate.get(TranslationConstants.SERVER_NOT_REACHABLE));
      await this.showError(not_reachable_msg);
    } else {
      await this.processStatusCodes(e);
    }
  }

  async processStatusCodes(e: HttpErrorResponse) {
    let msg!: string;
    if (e.status >= 500) {
      msg = await lastValueFrom(this.translate.get(TranslationConstants.DEFAULT_MESSAGE));
    }
    else if (e.status == 401) {
      msg = await lastValueFrom(this.translate.get(TranslationConstants.HTTP_UNAUTHORIZED));
    }
    else if (e.status == 403) {
      if (Array.isArray(e.error) && e.error.length > 0) {
        msg = await lastValueFrom(this.translate.get(TranslationConstants.MISSING_PERMISSION));
        msg += ": " + e.error.join(', ')
      }
      else
        msg = await lastValueFrom(this.translate.get(TranslationConstants.HTTP_FORBIDDEN));
    }
    else if (e.status == 404) {
      msg = await lastValueFrom(this.translate.get(TranslationConstants.HTTP_NOT_FOUND));
    }
    else if (e.status == 405) {
      msg = await lastValueFrom(this.translate.get(TranslationConstants.HTTP_METHOD_NOT_ALLOWED));
    }
    else if (e.status >= 400 && (typeof e.error === 'string' || e.error instanceof String)) {
      msg = e.error as string;
    }
    else if (e.status >= 400) {
      msg = await lastValueFrom(this.translate.get(TranslationConstants.HTTP_BAD_REQUEST));
    }
    else {
      msg = await lastValueFrom(this.translate.get(TranslationConstants.UNKNOWN_ERROR));
    }

    await this.showError(msg);
  }
}
