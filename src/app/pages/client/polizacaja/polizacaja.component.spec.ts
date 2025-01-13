import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PolizacajaComponent } from './polizacaja.component';

describe('PolizacajaComponent', () => {
  let component: PolizacajaComponent;
  let fixture: ComponentFixture<PolizacajaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PolizacajaComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PolizacajaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
