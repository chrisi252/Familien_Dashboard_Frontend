import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditUsers } from './edit-users';

describe('EditUsers', () => {
  let component: EditUsers;
  let fixture: ComponentFixture<EditUsers>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditUsers]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditUsers);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
