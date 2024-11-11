import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MovimientostablaComponent } from './movimientostabla.component';

describe('MovimientostablaComponent', () => {
  let component: MovimientostablaComponent;
  let fixture: ComponentFixture<MovimientostablaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MovimientostablaComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MovimientostablaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
