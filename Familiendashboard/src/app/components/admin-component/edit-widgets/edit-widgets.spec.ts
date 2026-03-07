import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditWidgets } from './edit-widgets';

describe('EditWidgets', () => {
  let component: EditWidgets;
  let fixture: ComponentFixture<EditWidgets>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditWidgets]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditWidgets);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
