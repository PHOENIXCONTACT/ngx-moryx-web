import { Component } from '@angular/core';
import { EmptyState } from '@moryx/ngx-web-framework/empty-state';

@Component({
    selector: 'app-empty-state-demo',
    templateUrl: './empty-state-demo.html',
    styleUrls: ['./empty-state-demo.scss'],
    standalone: true,
    imports: [EmptyState]
})
export class EmptyStateDemo {
  constructor() {

  }
}
