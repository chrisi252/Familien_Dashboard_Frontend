import { Component, inject, OnInit } from '@angular/core';
import { switchMap } from 'rxjs';
import { FamilyService } from '../../../services/family-service';
import { FamilyMember } from '../../../interfaces/user';
import { UserStateService } from '../../../services/user-state-service';

@Component({
  selector: 'app-edit-users',
  imports: [],
  templateUrl: './edit-users.html',
  styleUrl: './edit-users.css',
})
export class EditUsers implements OnInit {
  private familyService = inject(FamilyService);
  private userState = inject(UserStateService);

  members: FamilyMember[] = [];

  ngOnInit() {
    this.userState.resolveCurrentFamilyId$().pipe(
      switchMap((familyId) => this.familyService.getFamilyById(familyId)),
    ).subscribe((detail) => {
      this.members = detail.members;
    });
  }
}
