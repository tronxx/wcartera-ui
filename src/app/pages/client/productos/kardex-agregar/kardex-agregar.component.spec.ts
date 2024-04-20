import { ComponentFixture, TestBed } from '@angular/core/testing';

import { KardexAgregarComponent } from './kardex-agregar.component';

describe('KardexAgregarComponent', () => {
  let component: KardexAgregarComponent;
  let fixture: ComponentFixture<KardexAgregarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ KardexAgregarComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(KardexAgregarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
