import { TestBed } from '@angular/core/testing';

import { NavigableEntryService } from './navigable-entry.service';

describe('NavigableEntryService', () => {
  let service: NavigableEntryService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(NavigableEntryService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
