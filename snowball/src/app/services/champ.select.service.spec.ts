import { TestBed } from '@angular/core/testing';

import { ChampSelectService } from './champ.select.service';

describe('ChampSelectService', () => {
  let service: ChampSelectService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ChampSelectService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
