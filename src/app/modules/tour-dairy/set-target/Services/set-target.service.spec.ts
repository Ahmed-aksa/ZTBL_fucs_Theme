import { TestBed } from '@angular/core/testing';

import { SetTargetService } from './set-target.service';

describe('SetTargetService', () => {
  let service: SetTargetService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SetTargetService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
