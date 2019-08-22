import { TestBed } from '@angular/core/testing';

import { LocalstoragePuzzleSourceService } from './localstorage-puzzle-source.service';

describe('LocalstoragePuzzleSourceService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: LocalstoragePuzzleSourceService = TestBed.get(LocalstoragePuzzleSourceService);
    expect(service).toBeTruthy();
  });
});
