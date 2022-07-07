import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EntryEditorDemoComponent } from './entry-editor-demo.component';

describe('EntryEditorDemoComponent', () => {
  let component: EntryEditorDemoComponent;
  let fixture: ComponentFixture<EntryEditorDemoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EntryEditorDemoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EntryEditorDemoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
