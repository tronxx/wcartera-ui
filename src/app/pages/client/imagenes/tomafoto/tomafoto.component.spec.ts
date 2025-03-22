import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TomafotoComponent } from './tomafoto.component';

describe('TomafotoComponent', () => {
  let component: TomafotoComponent;
  let fixture: ComponentFixture<TomafotoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TomafotoComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TomafotoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
