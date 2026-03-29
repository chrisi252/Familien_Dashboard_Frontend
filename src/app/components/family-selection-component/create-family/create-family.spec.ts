import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateFamily } from './create-family';

describe('CreateFamily', () => {
  let component: CreateFamily;
  let fixture: ComponentFixture<CreateFamily>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CreateFamily]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreateFamily);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
