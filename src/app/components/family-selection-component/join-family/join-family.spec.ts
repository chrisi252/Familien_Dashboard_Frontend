import { ComponentFixture, TestBed } from '@angular/core/testing';

import { JoinFamily } from './join-family';

describe('JoinFamily', () => {
  let component: JoinFamily;
  let fixture: ComponentFixture<JoinFamily>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [JoinFamily]
    })
    .compileComponents();

    fixture = TestBed.createComponent(JoinFamily);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
