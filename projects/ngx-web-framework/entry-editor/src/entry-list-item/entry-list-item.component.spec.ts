import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EntryListItemComponent } from './entry-list-item.component';

describe('EntryListItemComponent', () => {
  let component: EntryListItemComponent;
  let fixture: ComponentFixture<EntryListItemComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
    imports: [EntryListItemComponent]
})
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EntryListItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
