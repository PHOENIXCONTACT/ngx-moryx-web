import { Injectable } from '@angular/core';
import './../extensions/array.extensions';
import './../extensions/string.extensions';
import './../extensions/observable.extensions';
import { AuthService } from './auth.service';
@Injectable({
  providedIn: 'root',
})
export class PermissionService {
  constructor(private authService: AuthService) {}

  async getPermissions() {
    return await this.authService.getUserPermissions$Json().toAsync();
  }

  async hasPermission(permissions: string[], permission: string, ignoreIam: boolean = false) {
    if (ignoreIam) {
      return true;
    }

    if (window.configs && !window.configs.identityUrl) {
      return true;
    }

    return permissions.any(p => p === permission);
  }
}
