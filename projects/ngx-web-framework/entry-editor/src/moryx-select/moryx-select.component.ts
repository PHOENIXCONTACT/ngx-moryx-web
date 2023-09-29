import { Component, EventEmitter, Input, Output, forwardRef } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { MatSelectChange } from '@angular/material/select';

@Component({
  selector: 'moryx-select',
  templateUrl: './moryx-select.component.html',
  styleUrls: ['./moryx-select.component.css'],
  providers: [
    {
        provide: NG_VALUE_ACCESSOR,
        useExisting: forwardRef(() => MoryxSelectComponent),
        multi: true
    }
]
})

export class MoryxSelectComponent implements ControlValueAccessor  {
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
  @Output() selectedValue = new EventEmitter<string>();
  value: string | undefined;
  @Input("disabled") disabled: boolean = false;

  constructor() {
  }
  writeValue(value: any): void {
    
  }
  registerOnChange(fn: any): void {
    
  }
  registerOnTouched(fn: any): void {
    
  }
  setDisabledState?(isDisabled: boolean): void {
    
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

  valueChanged(event: MatSelectChange)
  {
    this.selectedValue.emit(event.value);
  }
}
