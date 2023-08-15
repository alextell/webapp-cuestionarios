import { TestBed } from '@angular/core/testing';

import { EncryService } from './encry.service';

describe('EncryService', () => {
  let service: EncryService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(EncryService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
