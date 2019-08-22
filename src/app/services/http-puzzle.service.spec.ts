import { TestBed } from '@angular/core/testing';

import { HttpPuzzleService } from './http-puzzle.service';

describe('HttpPuzzleService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: HttpPuzzleService = TestBed.get(HttpPuzzleService);
    expect(service).toBeTruthy();
  });
});
