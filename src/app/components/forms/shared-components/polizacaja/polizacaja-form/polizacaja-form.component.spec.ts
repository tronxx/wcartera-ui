import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PolizacajaFormComponent } from './polizacaja-form.component';

describe('PolizacajaFormComponent', () => {
  let component: PolizacajaFormComponent;
  let fixture: ComponentFixture<PolizacajaFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PolizacajaFormComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PolizacajaFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
