import { Component } from '@angular/core';
import { EmptyStateComponent } from '@moryx/ngx-web-framework/empty-state';

@Component({
    selector: 'app-empty-state-demo',
    templateUrl: './empty-state-demo.component.html',
    styleUrls: ['./empty-state-demo.component.scss'],
    standalone: true,
    imports: [EmptyStateComponent]
})
export class EmptyStateDemoComponent {
  constructor() {

  }
}
