import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DatosventaComponent } from './datosventa.component';

describe('DatosventaComponent', () => {
  let component: DatosventaComponent;
  let fixture: ComponentFixture<DatosventaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DatosventaComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DatosventaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
