import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AppComponent } from './app.component';
import { EntryEditorDemoComponent } from './entry-editor-demo/entry-editor-demo.component';

const routes: Routes = [
  {path: 'entry-editor-demo/:entryParams', component:EntryEditorDemoComponent},
  {path: '', component:AppComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
