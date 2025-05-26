import {
  Directive,
  Input,
  TemplateRef,
  ViewContainerRef,
  OnInit,
} from '@angular/core';
import { AuthService } from '../services';
import '../extensions/observable.extensions'

@Directive({ selector: '[moryxIfHasPermission]' })
export class MoryxIfHasPermissionDirective implements OnInit {
  @Input('moryxIfHasPermission')
  set hasPermission(permission: string | string[]) {
    this.requiredPermissions = Array.isArray(permission)
      ? permission
      : [permission];
    this.filter = this.longestCommonPrefix(this.requiredPermissions);
    this.updateView();
  }

  @Input('moryxIfHasPermissionExcept')
  set ignoreIam(bool: boolean) {
    this._ignoreIam = bool;
    if ((this.iamIsEnabled() || this._ignoreIam) && this.isHidden)
    {
      this.viewContainer.createEmbeddedView(this.templateRef);
      this.isHidden = false;
    }
  }

  @Input()
  set moryxHasPermissionOperator(permop: 'AND' | 'OR') {
    this.logicalOp = permop;
    this.updateView();
  }

  private requiredPermissions = [] as string[];
  private filter?: string;
  private logicalOp = 'AND';
  private isHidden = true;
  private _ignoreIam = false;

  constructor(
    private authService: AuthService,
    private templateRef: TemplateRef<any>,
    private viewContainer: ViewContainerRef
  ) {}

  ngOnInit() {}

  private longestCommonPrefix(permissions: string[]) {
    // check border cases size 1 array and empty first word)
    if (!permissions[0] || permissions.length == 1) return permissions[0] || '';
    let i = 0;
    // while all words have the same character at position i, increment i
    while (
      permissions[0][i] &&
      permissions.every((p) => p[i] === permissions[0][i])
    )
      i++;

    // prefix is the substring from the beginning to the last successfully checked i
    return permissions[0].substring(0, i);
  }

  private async updateView() {
    if(this._ignoreIam) 
      return;

    let hasPermissions = await this.checkPermission();
    if (!this.iamIsEnabled() || (hasPermissions && this.isHidden)) {
      this.viewContainer.createEmbeddedView(this.templateRef);
      this.isHidden = false;
    } else {
      if(!this._ignoreIam) { // in case, _ignoreIam was set before checkPermission() finished
        this.isHidden = true;
        this.viewContainer.clear();
      }
    }
  }

  private iamIsEnabled(): Boolean {
    return !!this.authService.rootUrl;
  }

  private async checkPermission() {
    const providedPermissions = await this.authService
      .getUserPermissions$Json({
        filter: encodeURIComponent(this.filter ?? ''),
      })
      .toAsync();

    if (providedPermissions?.length && this.logicalOp === 'OR')
      return this.requiredPermissions.find((rp) =>
        providedPermissions.find((pp) => pp === rp)
      );
    else
      return this.requiredPermissions.every((rp) =>
        providedPermissions.find((pp) => pp == rp)
      );
  }
}
