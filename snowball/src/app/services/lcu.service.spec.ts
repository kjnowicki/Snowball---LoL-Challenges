import { TestBed } from '@angular/core/testing';

import { LcuService } from './lcu.service';

describe('LcuService', () => {
  let service: LcuService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LcuService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
