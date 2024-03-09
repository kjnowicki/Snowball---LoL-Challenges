import { TestBed } from '@angular/core/testing';

import { DataDragonService } from './data-dragon.service';

describe('DataDragonService', () => {
  let service: DataDragonService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DataDragonService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
