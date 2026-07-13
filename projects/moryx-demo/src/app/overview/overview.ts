import { Component, ChangeDetectionStrategy, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { RouterLink } from '@angular/router';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { DemoDialog } from '../demo-dialog/demo-dialog';

@Component({
    selector: 'app-overview',
    templateUrl: './overview.html',
    styleUrls: ['./overview.scss'],
    changeDetection: ChangeDetectionStrategy.Eager,
    imports: [RouterLink, MatButtonModule, MatDialogModule]
})
export class Overview {
  private dialog = inject(MatDialog);

  protected openDialog(): void {
    this.dialog.open(DemoDialog);
  }
}
