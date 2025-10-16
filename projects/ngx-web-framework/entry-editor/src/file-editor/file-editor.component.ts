import { Component, effect, ElementRef, input, model, ViewChild } from '@angular/core';
import { FormsModule, ReactiveFormsModule, UntypedFormControl, ValidatorFn, Validators } from '@angular/forms';
import { Entry } from '../models/entry';
import { EntryValueType } from '../models/entry-value-type';
import { EntryValue } from '../models/entry-value';
import { CommonModule } from '@angular/common';
import { MatError, MatFormField, MatLabel } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconButton } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
    selector: 'entry-file-editor',
    templateUrl: './file-editor.component.html',
    styleUrls: ['./file-editor.component.scss'],
    standalone: true,
    imports: [CommonModule, MatFormField, MatLabel, FormsModule, MatError, ReactiveFormsModule, MatInputModule, MatIconButton, MatIconModule]
})

export class FileEditorComponent {
  @ViewChild('fileUpload') fileUpload!: ElementRef<HTMLInputElement>;
  @ViewChild('directoryUpload') directoryUpload!: ElementRef<HTMLInputElement>;
  
  inputFormControl!: UntypedFormControl; 
  private readOnly: boolean | undefined = undefined;

  disabled = input<boolean>(false);
  entry = model.required<Entry>();

  constructor() {
    const reference = effect(() => {
      this.initialize(this.entry());
      reference.destroy();
    })
    
    effect(() => {
      this.disableInputFormControl(this.inputFormControl, this.disabled());
    });
  }

  initialize(entry: Entry) {
    const validators = this.setupValidators(entry);
    this.inputFormControl = this.setupFormControl(entry, validators);
    this.readOnly = entry.value?.isReadOnly;
  }

  private updateCurrentValue(currentValue: EntryValue, value: any) {
    this.entry.update(e => {
      let copy = Object.assign({}, e);
      copy.value.current = value ?? currentValue?.default;
      return copy;
    });
  }

  disableInputFormControl(control: UntypedFormControl, disable: boolean) {
    if (disable || this.readOnly) 
      control.disable();
    else 
      control.enable();
  }

  setupValidators(entry: Entry): ValidatorFn[] {
    let validators = [] as ValidatorFn[];
    if (entry.validation?.isRequired)
      validators.push(Validators.required);

    return validators;
  }

  private setupFormControl(entry: Entry, validators: ValidatorFn[]): UntypedFormControl {
    let result = new UntypedFormControl(
      {
        value: entry.description ?? '',
        disabled: this.disabled 
          || (entry.value.isReadOnly ?? false) 
          || entry.value?.type === EntryValueType.Stream
      }, 
      validators);

    return result;
  }

  onTriggerUpload() {
    const isDirectory = this.entry().value.unitType === "Directory";
    const input = isDirectory ? this.directoryUpload : this.fileUpload;

    if (input) {
      input.nativeElement.click();
    }
  }

  private uploadFiles(files: [File]) {
    const reader = new FileReader();

    reader.onloadend = (event) => {
      const result = event.target?.result as String;

      if (result) {
        // Use a regex to remove data url part
        const base64String = result
          .replace('data:', '')
          .replace(/^.+,/, '');
        this.updateCurrentValue(this.entry().value, base64String);
      }
    }

    for (const file of files) {
      reader.readAsDataURL(file);
    }
  }

  onFileSelected(event: any){
    const file: File = event.target.files[0];
    if (!file) {
      return
    }

    this.inputFormControl.setValue(file.name);
    
    this.uploadFiles([file]);
  }

  onDirectorySelected(event: any) {
    const file: File = event.target.files[0];

    if (!file) {
      return;
    }

    const directoryName = file.webkitRelativePath.split('/')[0];
    this.inputFormControl.setValue(directoryName);

    this.uploadFiles(event.target.files);
  }
}
