import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SnackbarDemoComponent } from './snackbar-demo.component';

describe('SnackbarDemoComponent', () => {
  let component: SnackbarDemoComponent;
  let fixture: ComponentFixture<SnackbarDemoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
    declarations: [SnackbarDemoComponent]
})
    .compileComponents();

    fixture = TestBed.createComponent(SnackbarDemoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
