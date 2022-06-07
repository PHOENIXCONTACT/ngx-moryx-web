import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { Entry } from '../models/entry';

@Component({
  selector: 'navigable-entry-editor',
  templateUrl: './navigable-entry-editor.component.html',
  styleUrls: ['./navigable-entry-editor.component.scss',]
})
export class NavigableEntryEditorComponent implements OnInit, OnDestroy {

  @Input() paramName!: string;
  @Input() disabled! :boolean;

  private _entry!: Entry;
  @Input() set entry(value: Entry){
    this._entry = value;
    this.buildEntryPath(value) 
    this.currentEntry = this.entryPath[this.entryPath.length-1];  
    this.createdCounter = 1;
  }
  get entry(): Entry { return this._entry; }

  
  entryPath!: Entry[];
  currentEntry!: Entry;
  createdCounter: number = 0;

  private routerSubscription: Subscription;
  
  constructor(private router: Router, private route: ActivatedRoute ) { 
    this.routerSubscription = router.events.subscribe(val => {
      if(val instanceof NavigationEnd){
        this.buildEntryPath(this._entry) ;
        this.currentEntry = this.entryPath[this.entryPath.length-1];  
      }
   });
  }
  
  ngOnInit(): void { }

  ngOnDestroy(): void {
    this.routerSubscription.unsubscribe();
  }

  buildEntryPath(value: Entry) {
    this.entryPath = [] as Entry[] 
    this.entryPath.push(value);
    let entry = value;
    let entries = this.route.snapshot.paramMap.get(this.paramName)?.split('.');
    if(entries === undefined)
      return;

    for(let entryIdentifier of entries){
      if(entryIdentifier === entry.identifier)
        continue;
      
      var subEntry = entry.subEntries?.find(x => x.identifier === entryIdentifier);
      if(subEntry !== undefined){
        this.entryPath.push(subEntry);
        entry = subEntry;         
      } else {
        var url = this.router.url;
        const index = url.lastIndexOf('/');
        var newUrl = url.substring(0,index+1);
        for(var e of this.entryPath){
          newUrl = newUrl + e.identifier + ".";
        }
        newUrl = newUrl.substring(0, newUrl.length-1);
        this.router.navigate([newUrl]);
      }
    }
  }  

  onNavigateLeft(){
    var currentEntryLength = (this.currentEntry?.identifier?.length ?? 0) +1;
    let url = this.router.url ;
    let newUrl = url.substring(0,url.length - currentEntryLength);
    this.router.navigate([newUrl]);
  }

  onNavigateSpecific(entry:Entry){
    if(entry.identifier === this.currentEntry?.identifier)
      return;
    var url = this.router.url;
    const index = url.lastIndexOf('/');
    var newUrl = url.substring(0,index+1);
    for(var e of this.entryPath){
      newUrl = newUrl + e.identifier + ".";
      if(e.identifier === entry.identifier)
        break;
    }
    newUrl = newUrl.substring(0, newUrl.length-1);
    this.router.navigate([newUrl]);
  }
}
