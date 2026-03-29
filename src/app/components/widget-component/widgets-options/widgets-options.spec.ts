import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WidgetsOptions } from './widgets-options';

describe('WidgetsOptions', () => {
  let component: WidgetsOptions;
  let fixture: ComponentFixture<WidgetsOptions>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WidgetsOptions]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WidgetsOptions);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
