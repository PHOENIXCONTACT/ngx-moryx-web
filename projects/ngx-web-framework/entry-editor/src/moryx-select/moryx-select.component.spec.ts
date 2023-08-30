import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MoryxSelectComponent } from './moryx-select.component';

describe('MoryxSelectComponent', () => {
  let component: MoryxSelectComponent;
  let fixture: ComponentFixture<MoryxSelectComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [MoryxSelectComponent]
    });
    fixture = TestBed.createComponent(MoryxSelectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
