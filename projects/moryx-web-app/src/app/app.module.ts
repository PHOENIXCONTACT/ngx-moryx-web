import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { EntryEditorModule } from '@moryx/ngx-web-framework/entry-editor';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { EntryEditorDemoComponent } from './entry-editor-demo/entry-editor-demo.component';

@NgModule({
  declarations: [
    AppComponent,
    EntryEditorDemoComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MatButtonModule,
    MatDividerModule,
    EntryEditorModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
