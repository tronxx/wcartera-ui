import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MovclisFormComponent } from './movclis-form.component';

describe('MovclisFormComponent', () => {
  let component: MovclisFormComponent;
  let fixture: ComponentFixture<MovclisFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MovclisFormComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MovclisFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
