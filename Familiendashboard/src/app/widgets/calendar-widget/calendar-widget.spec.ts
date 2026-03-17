import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CalendarWidget } from './calendar-widget';

describe('CalendarWidget', () => {
  let component: CalendarWidget;
  let fixture: ComponentFixture<CalendarWidget>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CalendarWidget]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CalendarWidget);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
