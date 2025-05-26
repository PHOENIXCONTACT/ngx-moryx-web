import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NavigableEntryEditorComponent } from './navigable-entry-editor.component';

describe('NavigableEntryEditorComponent', () => {
  let component: NavigableEntryEditorComponent;
  let fixture: ComponentFixture<NavigableEntryEditorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
    imports: [NavigableEntryEditorComponent]
})
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NavigableEntryEditorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
