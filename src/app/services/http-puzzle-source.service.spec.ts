import { TestBed } from '@angular/core/testing';

import { HttpPuzzleSourceService } from './http-puzzle-source.service';

describe('HttpPuzzleSourceService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: HttpPuzzleSourceService = TestBed.get(HttpPuzzleSourceService);
    expect(service).toBeTruthy();
  });
});
