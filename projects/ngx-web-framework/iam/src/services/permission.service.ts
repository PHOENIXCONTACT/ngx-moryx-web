import { Injectable } from '@angular/core';
import { ApiConfiguration } from '../api-configuration';
import './../extensions/array.extensions';
import './../extensions/string.extensions';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root',
})
export class PermissionService {
  private userPermissions: string[] = [];

  constructor(private authService: AuthService, private apiConfigs: ApiConfiguration) {
    this.getPermissions();
  }

  private getPermissions() {
    this.authService.getUserPermissions$Json().subscribe({
      next: permissions => (this.userPermissions = permissions),
    });
  }

  hasPermission(permission: string, ignoreIam: boolean = false): boolean {
    if (ignoreIam || this.apiConfigs.rootUrl.isNullOrWhiteSpaces()) {
      return true;
    }

    return this.userPermissions.any(p => p === permission);
  }
}
