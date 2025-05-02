import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomDateAdapterComponent } from './custom-date-adapter.component';

describe('CustomDateAdapterComponent', () => {
  let component: CustomDateAdapterComponent;
  let fixture: ComponentFixture<CustomDateAdapterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CustomDateAdapterComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CustomDateAdapterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
