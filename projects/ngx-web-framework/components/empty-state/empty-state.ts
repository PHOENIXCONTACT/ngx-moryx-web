import {Component, input} from '@angular/core';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'empty-state',
  imports: [MatIconModule],
  templateUrl: './empty-state.html',
  styleUrl: './empty-state.scss',
})
export class EmptyState {
  header = input.required<string>();
  message = input.required<string>();
  icon = input<string>('rocket_launch');
}
