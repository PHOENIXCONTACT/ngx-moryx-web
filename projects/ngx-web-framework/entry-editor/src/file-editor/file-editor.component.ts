import { Component, Input, OnInit } from '@angular/core';
import { Entry } from '../models/entry';
import { EntryValueType } from '../models/entry-value-type';
import { FormControl, ValidatorFn, Validators } from '@angular/forms';

@Component({
  selector: 'entry-file-editor',
  templateUrl: './file-editor.component.html',
  styleUrls: ['./file-editor.component.scss']
})
export class FileEditorComponent implements OnInit {

  @Input() entry!: Entry;
  private _disabled: boolean = false;
  @Input() set disabled(value: boolean) {
    this._disabled = value;
    if(value)
      this.inputFormControl?.disable();
    else
      this.inputFormControl?.enable();
  }
  get disabled(): boolean { return this._disabled; }

  inputFormControl!: FormControl; 

  constructor() { }

  ngOnInit(): void {
    var validators = [] as ValidatorFn[];
    if (this.entry.validation?.isRequired)
      validators.push(Validators.required);

    this.inputFormControl = new FormControl(
      {
        value: this.entry.description ?? '',
        disabled: this.disabled 
          || (this.entry.value?.isReadOnly ?? false) 
          || this.entry.value?.type === EntryValueType.Stream
      }, 
      validators);
  }

  onFileSelected(event: any){
    const file:File = event.target.files[0];
    if (file) {
      this.inputFormControl.setValue(file.name);
      const reader = new FileReader();
      reader.readAsBinaryString(file);
      reader.onload = (event) => this.entry.value.current = event.target?.result?.toString();
    }
  }
}
