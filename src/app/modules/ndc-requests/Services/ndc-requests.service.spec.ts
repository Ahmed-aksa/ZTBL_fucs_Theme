import { TestBed } from '@angular/core/testing';

import { NdcRequestsService } from './ndc-requests.service';

describe('NdcRequestsService', () => {
  let service: NdcRequestsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(NdcRequestsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
