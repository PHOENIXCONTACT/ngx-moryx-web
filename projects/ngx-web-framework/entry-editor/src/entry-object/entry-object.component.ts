import { Component, OnInit, Input } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Entry } from '../models/entry';
import { NavigableEntryService } from '../services/navigable-entry.service';
@Component({
    selector: 'entry-object-editor',
    templateUrl: './entry-object.component.html',
    styleUrls: ['./entry-object.component.scss'],
    standalone: false
})
export class EntryObjectComponent implements OnInit {
  
  @Input() entry!:Entry;
  @Input() editorId!: number;
  constructor(private service: NavigableEntryService) { }

  ngOnInit(): void {
  }

  onOpen(){
    this.service.onOpenEntry(this.editorId, this.entry);
  }
}
