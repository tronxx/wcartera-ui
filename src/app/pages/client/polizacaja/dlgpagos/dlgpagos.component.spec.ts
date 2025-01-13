import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DlgpagosComponent } from './dlgpagos.component';

describe('DlgpagosComponent', () => {
  let component: DlgpagosComponent;
  let fixture: ComponentFixture<DlgpagosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DlgpagosComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DlgpagosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
