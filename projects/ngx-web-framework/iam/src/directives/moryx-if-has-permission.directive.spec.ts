import { HttpContext } from '@angular/common/http';
import {
  Component,
  DebugElement,
} from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { AuthService } from '../services';
import { MoryxIfHasPermissionDirective } from './moryx-if-has-permission.directive';

@Component({
  template: `
    <div *moryxIfHasPermission="'Permissions.Permitted'">
      <p>This is permitted</p>
    </div>
    <div *moryxIfHasPermission="'Permissions.Forbidden'; except: ignore">
      <p>This is forbidden</p>
    </div>
  `,
})
class TestComponent {
  ignore = true;
}

describe('MoryxIfHasPermissionDirective', () => {
  let fixture: ComponentFixture<TestComponent> | null;
  let component: TestComponent;

  let authServiceStub = {
    getUserPermissions$Json: function (filter?: string, context?: HttpContext) {
      return of(new Array<string>('Permissions.Permitted'));
    },
  };

  beforeEach(() => {
    fixture = TestBed.configureTestingModule({
        imports: [],
        declarations: [MoryxIfHasPermissionDirective, TestComponent],
        providers: [{ provide: AuthService, useValue: authServiceStub }],
      }).createComponent(TestComponent);
    component = fixture.componentInstance;

    fixture.detectChanges();
  });

  it('should show permitted elements', (done) => {
    const element = getElement(fixture);
    component.ignore = false;
    fixture?.detectChanges();
    fixture?.whenStable().then(() => {
      expect(element?.nativeElement.innerHTML).toContain('This is permitted');
      done();
    });
  });

  it('should hide forbidden elements', (done) => {
    const element = getElement(fixture);
    component.ignore = false;
    fixture?.detectChanges();
    fixture?.whenStable().then(() => {
      expect(element?.nativeElement.innerHTML).not.toContain('This is forbidden');
      done();
    });
  });

  it('should show forbidden elements when *excepted*', (done) => {
    const element = getElement(fixture);
    fixture?.whenStable().then(() => {
      expect(element?.nativeElement.innerHTML).toContain('This is forbidden');
      done();
    });
  });

  afterEach(() => {
    fixture = null;
  });
});

function getElement(fixture: ComponentFixture<any> | null): DebugElement | undefined {
  return fixture?.debugElement;
}
