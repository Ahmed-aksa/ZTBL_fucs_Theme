import { TestBed } from '@angular/core/testing';

import { TourDiaryService } from './tour-diary.service';

describe('TourDiaryService', () => {
  let service: TourDiaryService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TourDiaryService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
