import { TestBed } from '@angular/core/testing';

import { HttpBackupSourceService } from './http-backup-source.service';

xdescribe('HttpBackupSourceService', () => {
  let service: HttpBackupSourceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(HttpBackupSourceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
