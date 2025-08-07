import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PideprecioComponent } from './pideprecio.component';

describe('PideprecioComponent', () => {
  let component: PideprecioComponent;
  let fixture: ComponentFixture<PideprecioComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PideprecioComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PideprecioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
