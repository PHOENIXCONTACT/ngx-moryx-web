import { Component, Input, forwardRef } from '@angular/core';

@Component({
  selector: 'moryx-select',
  templateUrl: './moryx-select.component.html',
  styleUrls: ['./moryx-select.component.css'],
})

export class MoryxSelectComponent  {
  list: string[] = [];
  search_list: string[] = [];
  _label: string | undefined | null;
  _uid: string | undefined | null;
  keyword: string = "";
  @Input("items") set items(value: string[] | undefined | null) {
    this.list = value ?? [];
    this.search_list = value ?? [];
  }
  @Input("label") label: string | undefined | null;
  @Input("uid") uid: string | undefined | null;
  value: string = "Select";

  constructor() {
  }

  search(request: string){
    const search = request.toLowerCase();
    if (search ){
      const result_list = this.search_list.filter((x: string) => x.toLowerCase().includes(search) );
      this.list = result_list; 
    }
    else {
      this.list = this.search_list;
    }
    return this.list;
  }
}
