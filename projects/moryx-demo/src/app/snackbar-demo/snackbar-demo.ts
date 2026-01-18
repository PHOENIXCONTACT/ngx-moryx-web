import { HttpErrorResponse } from '@angular/common/http';
import { Component } from '@angular/core';
import { SnackbarService } from '@moryx/ngx-web-framework/services';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-snackbar-demo',
  imports: [MatButtonModule],
  templateUrl: './snackbar-demo.html',
  styleUrls: ['./snackbar-demo.scss'],
})
export class SnackbarDemo {
  private multiplePermissions = ["Moryx.Example.Permission1", "Moryx.Example.Permission2"];
  private singlePermission = ["Moryx.Example.Permission3"];

  constructor(private snackbarService: SnackbarService) {
  }

  handlePermissionsMissing(): void {
    this.snackbarService.handleError(new HttpErrorResponse({error: this.multiplePermissions, status: 403}));
  }

  handlePermissionMissing(): void {
    this.snackbarService.handleError(new HttpErrorResponse({error: this.singlePermission, status: 403}));
  }

  handleForbidden(): void {
    this.snackbarService.handleError(new HttpErrorResponse({status: 403}));
  }
}
