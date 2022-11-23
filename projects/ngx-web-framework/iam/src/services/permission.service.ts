import { Injectable } from '@angular/core';
import './../extensions/array.extensions';
import './../extensions/string.extensions';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root',
})
export class PermissionService {
  private userPermissions: string[] = [];

  constructor(private authService: AuthService) {
    this.getPermissions();
  }

  private getPermissions() {
    this.authService.getUserPermissions$Json().subscribe({
      next: permissions => (this.userPermissions = permissions),
    });
  }

  hasPermission(permission: string, ignoreIam: boolean = false): boolean {
    if (ignoreIam) {
      return true;
    }

    if(window.configs && window.configs.identityUrl && window.configs.identityUrl.isNullOrWhiteSpaces()) {
      return true;
    }

    return this.userPermissions.any(p => p === permission);
  }
}
