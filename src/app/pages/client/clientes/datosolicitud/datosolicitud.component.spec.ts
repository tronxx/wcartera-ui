import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DatosolicitudComponent } from './datosolicitud.component';

describe('DatosolicitudComponent', () => {
  let component: DatosolicitudComponent;
  let fixture: ComponentFixture<DatosolicitudComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DatosolicitudComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DatosolicitudComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
