import { Component, inject, input } from '@angular/core';
import { Entry } from '../models/entry';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { NavigableEntryService } from '../services/navigable-entry.service';

@Component({
  selector: 'entry-object-editor',
  imports: [MatButtonModule, MatIconModule],
  templateUrl: './entry-object.html',
  styleUrl: './entry-object.scss',
})
export class EntryObject {
  private navigableEntryService = inject(NavigableEntryService);

  entry = input.required<Entry>();
  editorId = input.required<number>();
  disabled = input<boolean>(false);

  onOpen(){
    this.navigableEntryService.onOpenEntry(this.editorId(), this.entry());
  }
}
