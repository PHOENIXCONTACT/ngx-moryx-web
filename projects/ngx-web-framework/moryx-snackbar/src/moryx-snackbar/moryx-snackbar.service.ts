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
    });
  }
}
