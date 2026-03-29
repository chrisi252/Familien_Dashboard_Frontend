import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { Router } from '@angular/router';

import { ProfileComponent } from './profile-component';
import { ProfileService } from '../../services/profile-service';

describe('ProfileComponent', () => {
  let component: ProfileComponent;
  let fixture: ComponentFixture<ProfileComponent>;

  beforeEach(async () => {
    const routerMock = {
      navigate: () => Promise.resolve(true),
    };

    const profileServiceMock = {
      getProfile: () =>
        of({
          id: 1,
          username: 'max',
          first_name: 'Max',
          last_name: 'Mustermann',
          is_active: true,
          created_at: '2026-01-01T00:00:00.000Z',
        }),
    };

    await TestBed.configureTestingModule({
      imports: [ProfileComponent],
      providers: [
        { provide: Router, useValue: routerMock },
        { provide: ProfileService, useValue: profileServiceMock },
      ],
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProfileComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
