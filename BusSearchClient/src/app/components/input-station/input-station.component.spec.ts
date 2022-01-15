import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InputStationComponent } from './input-station.component';

describe('InputStationComponent', () => {
  let component: InputStationComponent;
  let fixture: ComponentFixture<InputStationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InputStationComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InputStationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
