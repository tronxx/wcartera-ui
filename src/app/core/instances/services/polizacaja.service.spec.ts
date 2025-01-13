import { TestBed } from '@angular/core/testing';

import { PolizacajaService } from './polizacaja.service';

describe('PolizacajaService', () => {
  let service: PolizacajaService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PolizacajaService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
