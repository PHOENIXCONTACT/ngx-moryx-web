import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EntryEditorComponent } from './entry-editor.component';

describe('EntryEditorComponent', () => {
  let component: EntryEditorComponent;
  let fixture: ComponentFixture<EntryEditorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
    imports: [EntryEditorComponent]
})
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EntryEditorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
