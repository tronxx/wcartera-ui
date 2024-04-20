import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DlgyesnoComponent } from './dlgyesno.component';

describe('DlgyesnoComponent', () => {
  let component: DlgyesnoComponent;
  let fixture: ComponentFixture<DlgyesnoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DlgyesnoComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DlgyesnoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
