import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MovtoeditComponent } from './movtoedit.component';

describe('MovtoeditComponent', () => {
  let component: MovtoeditComponent;
  let fixture: ComponentFixture<MovtoeditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MovtoeditComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MovtoeditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
