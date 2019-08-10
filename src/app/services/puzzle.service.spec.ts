import { TestBed } from '@angular/core/testing';

import { PuzzleService } from './puzzle.service';

describe('PuzzleServiceService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: PuzzleService = TestBed.get(PuzzleService);
    expect(service).toBeTruthy();
  });
});
