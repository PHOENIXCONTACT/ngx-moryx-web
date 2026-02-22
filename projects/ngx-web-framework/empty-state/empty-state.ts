import {Component, input} from '@angular/core';

@Component({
  selector: 'empty-state',
  imports: [],
  templateUrl: './empty-state.html',
  styleUrl: './empty-state.scss',
})
export class EmptyState {
  header = input.required<string>();
  message = input.required<string>();
  icon = input<string>('rocket_launch');
}
