import { TestBed } from '@angular/core/testing';

import { PuzzleStoreService } from './puzzle-store.service';

describe('PuzzleStoreService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: PuzzleStoreService = TestBed.get(PuzzleStoreService);
    expect(service).toBeTruthy();
  });
});
