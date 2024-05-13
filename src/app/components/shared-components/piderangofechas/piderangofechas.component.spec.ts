import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PiderangofechasComponent } from './piderangofechas.component';

describe('PiderangofechasComponent', () => {
  let component: PiderangofechasComponent;
  let fixture: ComponentFixture<PiderangofechasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PiderangofechasComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PiderangofechasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
