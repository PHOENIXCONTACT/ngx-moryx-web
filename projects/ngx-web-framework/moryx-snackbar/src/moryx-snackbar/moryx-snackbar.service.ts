import { HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { LanguageService } from '@moryx/ngx-web-framework/shell-services';
import { TranslateService } from '@ngx-translate/core';
import '../extensions/observable.extensions';
import { TranslationConstants } from '../languages/translation-constants';

@Injectable({
  providedIn: 'root',
})
export class MoryxSnackbarService {
  constructor(
    private snackbar: MatSnackBar,
    private languageService: LanguageService,
    public translate: TranslateService
  ) {
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
      msg = await this.translate.get(TranslationConstants.DEFAULT_MESSAGE).toAsync();
    }
    const dismissMessage = await this.translate.get(TranslationConstants.DISMISS).toAsync();

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
      msg = await this.translate.get(TranslationConstants.SUCCESS).toAsync();
    }
    const dismissMessage = await this.translate.get(TranslationConstants.DISMISS).toAsync();

    this.snackbar.open(msg, dismissMessage, {
      duration: 5000,
      panelClass: 'success',
    });
  }

  async handleError(e: HttpErrorResponse) {
    if (e.status === 0) {
      const not_reachable_msg = await this.translate.get(TranslationConstants.SERVER_NOT_REACHABLE).toAsync();
      await this.showError(not_reachable_msg);
    } else {
      await this.processStatusCodes(e);
    }
  }

  async processStatusCodes(e: HttpErrorResponse) {
    let msg!: string;
    if(e.status >= 500) {
      msg = await this.translate.get(TranslationConstants.DEFAULT_MESSAGE).toAsync();
    }
    else if(e.status >= 400) {
      if(e.status == 401) {
        msg = await this.translate.get(TranslationConstants.HTTP_UNAUTHORIZED).toAsync();
      }
      else if(e.status == 403) {
        msg = await this.translate.get(TranslationConstants.HTTP_FORBIDDEN).toAsync();
      }
      else if(e.status == 404) {
        msg = await this.translate.get(TranslationConstants.HTTP_NOT_FOUND).toAsync();
      }
      else if(e.status == 405) {
        msg = await this.translate.get(TranslationConstants.HTTP_METHOD_NOT_ALLOWED).toAsync();
      }
      else if(typeof e.error === 'string' || e.error instanceof String) {
        msg = e.error as string;
      } else {
        msg = await this.translate.get(TranslationConstants.HTTP_BAD_REQUEST).toAsync();
      }
    } 
    else {
      msg = await this.translate.get(TranslationConstants.UNKNOWN_ERROR).toAsync();
    } 

    await this.showError(msg);
  }
}
