import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';

import { RecoverFormComponent } from './recover-form.component';

describe('RecoverFormComponent', () => {
  let component: RecoverFormComponent;
  let fixture: ComponentFixture<RecoverFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports : [
        ReactiveFormsModule
      ],
      declarations: [ RecoverFormComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RecoverFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
