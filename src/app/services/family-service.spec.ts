import { TestBed } from '@angular/core/testing';

import { FamilyService } from './family-service';

describe('FamilyService', () => {
  let service: FamilyService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FamilyService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
