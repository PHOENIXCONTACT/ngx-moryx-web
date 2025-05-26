import { Component, input } from '@angular/core';
import { Entry } from '../models/entry';
import {MatIconModule} from '@angular/material/icon';
import {MatButtonModule} from '@angular/material/button';
import { NavigableEntryService } from '../services/navigable-entry.service';
@Component({
    selector: 'entry-object-editor',
    templateUrl: './entry-object.component.html',
    styleUrls: ['./entry-object.component.scss'],
    standalone: true,
    imports: [MatButtonModule, MatIconModule],
})
export class EntryObjectComponent {
  
  entry = input.required<Entry>();
  editorId = input.required<number>();

  constructor(private service: NavigableEntryService) { }

  onOpen(){
    this.service.onOpenEntry(this.editorId(), this.entry());
  }
}
