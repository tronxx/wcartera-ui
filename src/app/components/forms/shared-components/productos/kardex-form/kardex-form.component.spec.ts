import { ComponentFixture, TestBed } from '@angular/core/testing';

import { KardexFormComponent } from './kardex-form.component';

describe('KardexFormComponent', () => {
  let component: KardexFormComponent;
  let fixture: ComponentFixture<KardexFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ KardexFormComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(KardexFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
