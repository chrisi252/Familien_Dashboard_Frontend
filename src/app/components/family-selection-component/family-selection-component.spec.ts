import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FamilySelectionComponent } from './family-selection-component';

describe('FamilySelectionComponent', () => {
  let component: FamilySelectionComponent;
  let fixture: ComponentFixture<FamilySelectionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FamilySelectionComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FamilySelectionComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
