import { Routes } from "@angular/router";
import { EntryEditorDemoComponent } from "./entry-editor-demo/entry-editor-demo.component";
import { EmptyStateDemoComponent } from "./empty-state-demo/empty-state-demo.component";
import { OverviewComponent } from "./overview/overview.component";
import { SnackbarDemoComponent } from "./snackbar-demo/snackbar-demo.component";

const routes: Routes = [
  { path: 'entry-editor', component: EntryEditorDemoComponent },
  { path: 'empty-state', component: EmptyStateDemoComponent },
  { path: 'snackbar', component: SnackbarDemoComponent },
  { path: '', component: OverviewComponent }
];