import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VencimientosComponent } from './vencimientos.component';

describe('VencimientosComponent', () => {
  let component: VencimientosComponent;
  let fixture: ComponentFixture<VencimientosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VencimientosComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VencimientosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
