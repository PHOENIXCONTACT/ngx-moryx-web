import { Component, Input, OnInit } from '@angular/core';
import { UntypedFormControl, ValidatorFn, Validators } from '@angular/forms';
import { Entry } from '../models/entry';
import { EntryValueType } from '../models/entry-value-type';

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
    if(value || this.entry.value.isReadOnly)
      this.inputFormControl?.disable();
    else
      this.inputFormControl?.enable();
  }
  get disabled(): boolean { return this._disabled; }

  inputFormControl!: UntypedFormControl; 

  constructor() { }

  ngOnInit(): void {
    var validators = [] as ValidatorFn[];
    if (this.entry.validation?.isRequired)
      validators.push(Validators.required);

    this.inputFormControl = new UntypedFormControl(
      {
        value: this.entry.description ?? '',
        disabled: this.disabled 
          || (this.entry.value.isReadOnly ?? false) 
          || this.entry.value?.type === EntryValueType.Stream
      }, 
      validators);
  }

  onFileSelected(event: any){
    const file:File = event.target.files[0];
    if (file) {
      this.inputFormControl.setValue(file.name);
      const reader = new FileReader();
      reader.onloadend = (event) => {
        const result = event.target?.result as String;
        if (result) {
          // Use a regex to remove data url part
          const base64String = result
            .replace('data:', '')
            .replace(/^.+,/, '');

          this.entry.value.current = base64String;
        }
      }
      reader.readAsDataURL(file);

    }
  }
}
