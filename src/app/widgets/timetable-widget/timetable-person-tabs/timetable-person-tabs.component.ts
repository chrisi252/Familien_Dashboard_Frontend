import { Component, input, output } from '@angular/core';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { heroPlus, heroTrash, heroXMark } from '@ng-icons/heroicons/outline';
import { FamilyMember } from '../../../interfaces/user';
import { TimetablePerson } from '../../../interfaces/timetable';

const ALL_PERSONS = '__all__';

const DEFAULT_COLORS = [
  '#3B82F6', '#EF4444', '#10B981', '#F59E0B',
  '#8B5CF6', '#EC4899', '#14B8A6', '#F97316',
];

@Component({
  selector: 'app-timetable-person-tabs',
  standalone: true,
  imports: [NgIcon],
  viewProviders: [provideIcons({ heroPlus, heroTrash, heroXMark })],
  templateUrl: './timetable-person-tabs.component.html',
})
export class TimetablePersonTabsComponent {
  familyMembers = input.required<FamilyMember[]>();
  persons = input.required<TimetablePerson[]>();
  selectedPerson = input.required<string>();
  showDeletePersonConfirm = input<string | null>(null);
  canEdit = input<boolean>(false);

  personSelected = output<string>();
  deletePersonRequested = output<string | null>();
  deletePersonConfirmed = output<string>();
  addEntryRequested = output<void>();

  readonly ALL_PERSONS = ALL_PERSONS;

  personColor(username: string): string {
    return this.persons().find((p) => p.person_name === username)?.color
      ?? DEFAULT_COLORS[this.familyMembers().findIndex((m) => m.user_username === username) % DEFAULT_COLORS.length]
      ?? '#6B7280';
  }

  personHasEntries(username: string): boolean {
    return this.persons().some((p) => p.person_name === username);
  }
}
