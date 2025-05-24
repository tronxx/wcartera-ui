import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AgregarmovtoComponent } from './agregarmovto.component';

describe('AgregarmovtoComponent', () => {
  let component: AgregarmovtoComponent;
  let fixture: ComponentFixture<AgregarmovtoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AgregarmovtoComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AgregarmovtoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
