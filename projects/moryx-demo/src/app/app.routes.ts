import { Routes } from '@angular/router';
import { EmptyStateDemo } from './empty-state-demo/empty-state-demo';
import { Overview } from './overview/overview';
import { SnackbarDemo } from './snackbar-demo/snackbar-demo';
import { EntryEditorDemo } from './entry-editor-demo/entry-editor-demo';

export const routes: Routes = [
  { path: 'entry-editor', component: EntryEditorDemo },
  { path: 'empty-state', component: EmptyStateDemo },
  { path: 'snackbar', component: SnackbarDemo },
  { path: '', component: Overview }
];
