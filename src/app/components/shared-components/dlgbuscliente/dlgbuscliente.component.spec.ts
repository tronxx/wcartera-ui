import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DlgbusclienteComponent } from './dlgbuscliente.component';

describe('DlgbusclienteComponent', () => {
  let component: DlgbusclienteComponent;
  let fixture: ComponentFixture<DlgbusclienteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DlgbusclienteComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DlgbusclienteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
