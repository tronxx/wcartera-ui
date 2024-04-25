import { ComponentFixture, TestBed } from '@angular/core/testing';

import { KardexSalidasComponent } from './kardex-salidas.component';

describe('KardexSalidasComponent', () => {
  let component: KardexSalidasComponent;
  let fixture: ComponentFixture<KardexSalidasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ KardexSalidasComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(KardexSalidasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
