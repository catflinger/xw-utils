import { TestBed } from '@angular/core/testing';

import { DevelopmentPuzzleSourceService } from './development-puzzle-source.service';

describe('DevelopmentPuzzleSourceService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: DevelopmentPuzzleSourceService = TestBed.get(DevelopmentPuzzleSourceService);
    expect(service).toBeTruthy();
  });
});
