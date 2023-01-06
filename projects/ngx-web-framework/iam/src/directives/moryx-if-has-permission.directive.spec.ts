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

class AuthServiceStub {
  rootUrl: string | undefined | null = 'https://localhost/';

  getUserPermissions$Json(filter?: string, context?: HttpContext) {
    return of(new Array<string>('Permissions.Permitted'));
  }
}

describe('MoryxIfHasPermissionDirective', () => {
  let fixture: ComponentFixture<TestComponent> | null;
  let component: TestComponent;

  let authServiceStub: AuthServiceStub | null = new AuthServiceStub();

  beforeEach(() => {
    fixture = TestBed.configureTestingModule({
      imports: [],
      declarations: [MoryxIfHasPermissionDirective, TestComponent],
      providers: [{ provide: AuthService, useValue: authServiceStub }],
    }).createComponent(TestComponent);
    component = fixture.componentInstance;
    component.ignore = false;

    fixture.detectChanges();
  });

  it('should show permitted elements', (done) => {
    const element = getElement(fixture); 
    fixture?.whenStable().then(() => {
      expect(element?.nativeElement.innerHTML).toContain('This is permitted');
      done();
    });
  });

  it('should hide forbidden elements', (done) => {
    const element = getElement(fixture);
    fixture?.whenStable().then(() => {
      expect(element?.nativeElement.innerHTML).not.toContain('This is forbidden');
      done();
    });
  });

  it('should show forbidden elements when *exccepted*', (done) => {
    component.ignore = true;
    fixture?.detectChanges();

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

describe('MoryxIfHasPermissionDirective without configuration', () => {
  let fixture: ComponentFixture<TestComponent> | null;
  let component: TestComponent;

  let authServiceStub: AuthServiceStub | null = new AuthServiceStub();

  beforeEach(() => {
    authServiceStub!.rootUrl = '';
    fixture = TestBed.configureTestingModule({
      imports: [],
      declarations: [MoryxIfHasPermissionDirective, TestComponent],
      providers: [{ provide: AuthService, useValue: authServiceStub }],
    }).createComponent(TestComponent);
    component = fixture.componentInstance;
    component.ignore = false;
   
    fixture.detectChanges();
  });

  it('should show forbidden elements when root url is empty', (done) => {
    const element = getElement(fixture);
    fixture?.whenStable().then(() => {
      expect(element?.nativeElement.innerHTML).toContain('This is permitted');
      expect(element?.nativeElement.innerHTML).toContain('This is forbidden');
      done();
    });
  });
  
  it('should show forbidden elements when root url is undefined', (done) => {
    authServiceStub!.rootUrl = undefined; 
    triggerChangeDetection(component, fixture);

    const element = getElement(fixture);
    fixture?.whenStable().then(() => {
      expect(element?.nativeElement.innerHTML).toContain('This is permitted');
      expect(element?.nativeElement.innerHTML).toContain('This is forbidden');
      done();
    });
  });

  it('should show forbidden elements when root url is null', (done) => {
    authServiceStub!.rootUrl = null; 
    triggerChangeDetection(component, fixture);

    const element = getElement(fixture);
    fixture?.whenStable().then(() => {
      expect(element?.nativeElement.innerHTML).toContain('This is permitted');
      expect(element?.nativeElement.innerHTML).toContain('This is forbidden');
      done();
    });
  });

  afterEach(() => {
    fixture = null;
  });
});

function triggerChangeDetection(component: TestComponent, fixture: ComponentFixture<TestComponent> | null) {
  // actually change object properties to have change detection triggered
  component.ignore = !component.ignore;
  fixture?.detectChanges();
  component.ignore = !component.ignore;
  fixture?.detectChanges();
}

function getElement(fixture: ComponentFixture<any> | null): DebugElement | undefined {
  return fixture?.debugElement;
}
