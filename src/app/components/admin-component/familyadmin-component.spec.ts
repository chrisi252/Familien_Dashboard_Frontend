import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FamilyadminComponent } from './familyadmin-component';

describe('FamilyadminComponent', () => {
  let component: FamilyadminComponent;
  let fixture: ComponentFixture<FamilyadminComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FamilyadminComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FamilyadminComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
