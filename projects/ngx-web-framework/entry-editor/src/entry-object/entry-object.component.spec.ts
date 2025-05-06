import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EntryObjectComponent } from './entry-object.component';

describe('EntryObjectComponent', () => {
  let component: EntryObjectComponent;
  let fixture: ComponentFixture<EntryObjectComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
    imports: [EntryObjectComponent]
})
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EntryObjectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
