import { Component, ElementRef, EventEmitter, HostListener, Input, Output, ViewChild, forwardRef } from '@angular/core';
import { NG_VALUE_ACCESSOR, ControlValueAccessor } from "@angular/forms";

@Component({
  selector: 'moryx-dropdown',
  templateUrl: './moryx-dropdown.component.html',
  styleUrls: ['./moryx-dropdown.component.css'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => MoryxDropdownComponent),
      multi: true
    }
  ]
})
export class MoryxDropdownComponent  implements ControlValueAccessor {
  list : string[] = [];
  temp_list: string [] = [];
  keyword : string = "";
  _label: string | undefined | null;
  _uid: string | undefined | null;
  @Output() afterChange = new EventEmitter();
  @ViewChild("input", { static: false }) input! : ElementRef;
  @Input("items") set items(value : string[] | undefined | null) {
  this.list = value ?? [];
  this.temp_list = value ?? [];
  }
  @Input("label") label : string | undefined | null;
  @Input("uid") uid : string |  undefined | null;

  value: string | number = "Select";
  shown = false;
  constructor(private ele: ElementRef){
  }
  ngOnChanges() {
    this._label = (typeof this.label !== 'undefined' && this.label !== '') ? this.label : 'name';
    this._uid = (typeof this.uid !== 'undefined' && this.uid !== '') ? this.uid : 'id';
    this.value = 'Select';
  }

  writeValue(value : string | number) {
    if (value) {
      this.temp_list.map((x : string | number) => {
        if (x == value) {
          this.value = x;
        }
      })
    }
  }
  registerOnChange(fn: void) {
    
  }
  registerOnTouched(fn: void) {
   
  }
  search(e : string ) {
      const val = e.toLowerCase();
         const temp = this.temp_list.filter((x : string) => {
      if (x.toLowerCase().indexOf(val) !== -1 || !val) {
        return x;
      }
      return "";
    });
    this.list = temp;
  }
 
  @HostListener("document:click", ["$event"]) onClick(e : Event) {
    if (!this.ele.nativeElement.contains(e.target)) {
      this.shown = false;
    }
  }
}
