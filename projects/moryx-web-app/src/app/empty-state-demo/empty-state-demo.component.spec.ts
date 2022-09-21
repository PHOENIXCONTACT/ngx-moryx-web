import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmptyStateDemoComponent } from './empty-state-demo.component';

describe('EmptyStateDemoComponent', () => {
  let component: EmptyStateDemoComponent;
  let fixture: ComponentFixture<EmptyStateDemoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EmptyStateDemoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EmptyStateDemoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
