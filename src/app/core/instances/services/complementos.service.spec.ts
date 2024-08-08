import { TestBed } from '@angular/core/testing';

import { ComplementosService } from './complementos.service';

describe('ComplementosService', () => {
  let service: ComplementosService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ComplementosService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
