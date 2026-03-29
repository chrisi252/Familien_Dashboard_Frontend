import { Component, inject, OnInit } from '@angular/core';
import { FamilyService } from '../../../services/family-service';

@Component({
  selector: 'app-edit-users',
  imports: [],
  templateUrl: './edit-users.html',
  styleUrl: './edit-users.css',
})
export class EditUsers implements OnInit {
  private familyService = inject(FamilyService);

  members: any[] = [];

  ngOnInit() {
    this.familyService.getFamilies().subscribe((res: any) => {
      const familyId = res.families[0].family.id;
      this.familyService.getFamilyById(familyId).subscribe((detail: any) => {
        this.members = detail.members;
      });
    });
  }
}
