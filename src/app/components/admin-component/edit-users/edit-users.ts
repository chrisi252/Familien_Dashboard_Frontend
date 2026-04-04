import { Component, inject, OnInit } from '@angular/core';
import { switchMap } from 'rxjs';
import { FamilyService } from '../../../services/family-service';
import { FamilyMember } from '../../../interfaces/user';

@Component({
  selector: 'app-edit-users',
  imports: [],
  templateUrl: './edit-users.html',
  styleUrl: './edit-users.css',
})
export class EditUsers implements OnInit {
  private familyService = inject(FamilyService);

  members: FamilyMember[] = [];

  ngOnInit() {
    this.familyService.getFamilies().pipe(
      switchMap((res) => {
        const familyId = res.families[0].family.id;
        return this.familyService.getFamilyById(familyId);
      })
    ).subscribe((detail) => {
      this.members = detail.members;
    });
  }
}
