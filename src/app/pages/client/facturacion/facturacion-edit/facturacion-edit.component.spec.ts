import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FacturacionEditComponent } from './facturacion-edit.component';

describe('FacturacionEditComponent', () => {
  let component: FacturacionEditComponent;
  let fixture: ComponentFixture<FacturacionEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FacturacionEditComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FacturacionEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
