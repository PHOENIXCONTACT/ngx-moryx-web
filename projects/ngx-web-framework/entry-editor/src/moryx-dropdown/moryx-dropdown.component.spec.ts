import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MoryxDropdownComponent } from './moryx-dropdown.component';

describe('CustomDropdownComponent', () => {
  let component: MoryxDropdownComponent;
  let fixture: ComponentFixture<MoryxDropdownComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [MoryxDropdownComponent]
    });
    fixture = TestBed.createComponent(MoryxDropdownComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
