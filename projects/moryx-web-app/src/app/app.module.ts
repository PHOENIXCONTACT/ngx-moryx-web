import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { EmptyStateModule } from '@moryx/ngx-web-framework/empty-state';
import { EntryEditorModule } from '@moryx/ngx-web-framework/entry-editor';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { EmptyStateDemoComponent } from './empty-state-demo/empty-state-demo.component';
import { EntryEditorDemoComponent } from './entry-editor-demo/entry-editor-demo.component';
import { OverviewComponent } from './overview/overview.component';

@NgModule({
  declarations: [AppComponent, EntryEditorDemoComponent, EmptyStateDemoComponent, OverviewComponent],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MatButtonModule,
    MatDividerModule,
    EntryEditorModule,
    EmptyStateModule,
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
