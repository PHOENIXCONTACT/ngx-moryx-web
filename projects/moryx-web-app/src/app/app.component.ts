import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Entry, EntryUnitType, EntryValueType } from '@moryx/ngx-web-framework/entry-editor';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'moryx-web-app';

  constructor(router: Router) {
    router.navigate([router.url + "/entry-editor-demo/RootEntry"])
  }
}
