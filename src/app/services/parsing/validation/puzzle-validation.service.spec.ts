import { TestBed } from '@angular/core/testing';

import { PuzzleValidationService } from './puzzle-validation.service';

describe('PuzzleValidationService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: PuzzleValidationService = TestBed.get(PuzzleValidationService);
    expect(service).toBeTruthy();
  });
});
