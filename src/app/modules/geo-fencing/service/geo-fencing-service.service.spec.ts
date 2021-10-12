import { TestBed } from '@angular/core/testing';

import { GeoFencingServiceService } from './geo-fencing-service.service';

describe('GeoFencingServiceService', () => {
  let service: GeoFencingServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GeoFencingServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
