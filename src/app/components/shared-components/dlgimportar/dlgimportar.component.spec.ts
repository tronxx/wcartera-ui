import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DlgimportarComponent } from './dlgimportar.component';

describe('DlgimportarComponent', () => {
  let component: DlgimportarComponent;
  let fixture: ComponentFixture<DlgimportarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DlgimportarComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DlgimportarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
