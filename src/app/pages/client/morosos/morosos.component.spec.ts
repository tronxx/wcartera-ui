import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MorososComponent } from './morosos.component';

describe('MorososComponent', () => {
  let component: MorososComponent;
  let fixture: ComponentFixture<MorososComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MorososComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MorososComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
