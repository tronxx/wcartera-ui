import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AlmacenesEditComponent } from './almacenes-edit.component';

describe('AlmacenesEditComponent', () => {
  let component: AlmacenesEditComponent;
  let fixture: ComponentFixture<AlmacenesEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AlmacenesEditComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AlmacenesEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
