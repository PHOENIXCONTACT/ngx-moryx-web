import { Component, input, model, output, ChangeDetectionStrategy } from '@angular/core';
import { Entry } from '../../models/entry';
import { EntryValueType } from '../../models/entry-value-type';
import { FileEditor } from '../../file-editor/file-editor';
import { EntryObject} from '../../entry-object/entry-object';
import { BooleanEditor } from '../../boolean-editor/boolean-editor';
import { InputEditor } from '../../input-editor/input-editor';
import { EnumEditor } from '../../enum-editor/enum-editor';
import { MatIconButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { TranslatePipe } from '@ngx-translate/core';
import { TranslationConstants } from '../../translation-constants';

@Component({
  selector: 'entry-list-item',
  imports: [
    FileEditor,
    EntryObject,
    BooleanEditor,
    InputEditor,
    EnumEditor,
    MatIconButton,
    MatIcon,
    MatMenuModule,
    TranslatePipe,
  ],
  templateUrl: './entry-list-item.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './entry-list-item.scss',
})
export class EntryListItem {
  entry = model.required<Entry>();
  editorId = input.required<number>();
  disabled = input<boolean>(false);
  isFirst = input<boolean>(false);
  isLast = input<boolean>(false);

  deleteRequest = output<Entry>();
  moveUpRequest = output<Entry>();
  moveDownRequest = output<Entry>();

  protected EntryValueType = EntryValueType;
  protected TranslationConstants = TranslationConstants;

  protected onDelete() {
    this.deleteRequest.emit(this.entry());
  }

  protected onMoveUp() {
    this.moveUpRequest.emit(this.entry());
  }

  protected onMoveDown() {
    this.moveDownRequest.emit(this.entry());
  }
}
