import { Component, OnInit, Input } from '@angular/core';
import { Router } from '@angular/router';
import { Entry } from '../models/entry';

@Component({
  selector: 'entry-object-editor',
  templateUrl: './entry-object.component.html',
  styleUrls: ['./entry-object.component.scss'],
})
export class EntryObjectComponent implements OnInit {
  @Input() entry!:Entry;
  constructor(private router: Router) { }

  ngOnInit(): void {
  }

  onOpen(){
    let url = this.router.url + "." + this.entry.identifier;
    this.router.navigate([url]);
  }
}
