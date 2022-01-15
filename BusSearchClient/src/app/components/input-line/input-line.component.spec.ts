import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InputLineComponent } from './input-line.component';

describe('InputLineComponent', () => {
  let component: InputLineComponent;
  let fixture: ComponentFixture<InputLineComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InputLineComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InputLineComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
