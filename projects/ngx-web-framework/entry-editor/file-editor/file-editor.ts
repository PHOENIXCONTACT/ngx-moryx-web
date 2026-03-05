import { Component, effect, input } from '@angular/core';
import { FormsModule, ReactiveFormsModule, UntypedFormControl, ValidatorFn, Validators } from '@angular/forms';
import { ReactiveEntry } from '../reactive-entry';
import { EntryValueType } from '../models/entry-value-type';
import { CommonModule } from '@angular/common';
import { MatError, MatFormField, MatLabel, MatHint } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconButton } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'entry-file-editor',
  imports: [
    CommonModule,
    MatFormField,
    MatLabel,
    FormsModule,
    MatError,
    ReactiveFormsModule,
    MatInputModule,
    MatIconButton,
    MatIconModule,
    MatHint
  ],
  templateUrl: './file-editor.html',
  styleUrl: './file-editor.scss',
})
export class FileEditor {
  inputFormControl!: UntypedFormControl;
  private readOnly: boolean | undefined = undefined;

  disabled = input<boolean>(false);
  reactiveEntry = input.required<ReactiveEntry>();

  constructor() {
    const reference = effect(() => {
      this.initialize(this.reactiveEntry());
      reference.destroy();
    });

    effect(() => {
      this.disableInputFormControl(this.inputFormControl, this.disabled());
    });
  }

  private initialize(re: ReactiveEntry) {
    const validators = this.setupValidators(re);
    this.inputFormControl = this.setupFormControl(re, validators);
    this.readOnly = re.value.isReadOnly;
  }

  private updateCurrentValue(re: ReactiveEntry, value: any) {
    re.setCurrentValue(value ?? re.value.default);
  }

  disableInputFormControl(control: UntypedFormControl, disable: boolean) {
    if (disable || this.readOnly)
      control.disable();
    else
      control.enable();
  }

  setupValidators(re: ReactiveEntry): ValidatorFn[] {
    let validators = [] as ValidatorFn[];
    if (re.validation?.isRequired)
      validators.push(Validators.required);

    return validators;
  }

  private setupFormControl(re: ReactiveEntry, validators: ValidatorFn[]): UntypedFormControl {
    const entryValue = re.value;
    const initial = entryValue.current ?? '';

    const ctrl = new UntypedFormControl(
      {
        value: initial,
        disabled: this.disabled() || (entryValue.isReadOnly ?? false) || entryValue?.type === EntryValueType.Stream,
      },
      validators
    );

    return ctrl;
  }

  onFileSelected(event: any) {
    const file: File = event.target.files[0];
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

          this.updateCurrentValue(this.reactiveEntry(), base64String);
        }
      };
      reader.readAsDataURL(file);
    }
  }
}
