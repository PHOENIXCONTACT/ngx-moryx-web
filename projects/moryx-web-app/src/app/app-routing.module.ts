import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { EmptyStateDemoComponent } from './empty-state-demo/empty-state-demo.component';
import { EntryEditorDemoComponent } from './entry-editor-demo/entry-editor-demo.component';
import { SnackbarDemoComponent } from './snackbar-demo/snackbar-demo.component';
import { OverviewComponent } from './overview/overview.component';

const routes: Routes = [
  { path: 'entry-editor', component: EntryEditorDemoComponent },
  { path: 'empty-state', component: EmptyStateDemoComponent },
  { path: 'snackbar', component: SnackbarDemoComponent },
  { path: '', component: OverviewComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }