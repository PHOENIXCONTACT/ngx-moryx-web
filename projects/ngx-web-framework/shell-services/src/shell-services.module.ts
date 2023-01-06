import { Injectable, NgModule } from '@angular/core';
import { Observable } from 'rxjs';
import { LanguageService } from './language-service/languageService.service';
import { SearchBarService } from './search-bar/search-bar.service';

@NgModule({
    declarations: [
        SearchBarService,
        LanguageService
    ],
    imports: [
        Injectable,
        Observable
    ],
    exports: [SearchBarService, LanguageService],
})
export class ShellServicesModule { }