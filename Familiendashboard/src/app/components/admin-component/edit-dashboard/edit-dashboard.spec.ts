import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditDashboard } from './edit-dashboard';

describe('EditDashboard', () => {
  let component: EditDashboard;
  let fixture: ComponentFixture<EditDashboard>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditDashboard]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditDashboard);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
