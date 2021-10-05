import { TestBed } from '@angular/core/testing';

import { JigsawService } from './jigsaw.service';

describe('JigsawService', () => {
  let service: JigsawService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(JigsawService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
