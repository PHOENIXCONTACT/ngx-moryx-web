import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit, Input } from '@angular/core';
import { MoryxSnackbarService } from '@moryx/ngx-web-framework/moryx-snackbar';

const multiplePermissions = ["Moryx.Example.Permission1", "Moryx.Example.Permission2"];
const singlePermission = ["Moryx.Example.Permission3"];

@Component({
    selector: 'app-snackbar-demo',
    templateUrl: './snackbar-demo.component.html',
    styleUrls: ['./snackbar-demo.component.scss'],
    standalone: false
})
export class SnackbarDemoComponent {
  constructor(private service: MoryxSnackbarService) {
  }

  handlePermissionsMissing(): void {
    this.service.handleError(new HttpErrorResponse({ error: multiplePermissions, status: 403 }));
  }

  handlePermissionMissing(): void {
    this.service.handleError(new HttpErrorResponse({ error: singlePermission, status: 403 }));
  }

  handleForbidden(): void {
    this.service.handleError(new HttpErrorResponse({ status: 403 }));
  }
}
