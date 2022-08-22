import { NgModule } from '@angular/core';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { SearchBarService } from './search-bar/search-bar.service';

@NgModule({
    declarations: [
        SearchBarService
    ],
    imports: [
        Injectable,
        Observable
    ],
    exports: [SearchBarService],
})
export class ShellServicesModule { }