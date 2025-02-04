import { Component, Input } from '@angular/core';

/** Note: empty-state requires the [header] and the [message] attributes to be passed */
@Component({
    selector: 'empty-state',
    templateUrl: './empty-state.component.html',
    styleUrls: ['./empty-state.component.scss'],
    standalone: false
})
export class EmptyStateComponent {
  @Input('icon') icon: string = 'rocket_launch';
  @Input('header') header!: string;
  @Input('message') message!: string;

  constructor() {}
}
