import { Component, input, output } from '@angular/core';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { heroPencil, heroTrash } from '@ng-icons/heroicons/outline';
import { TimetableEntry } from '../../../interfaces/timetable';

@Component({
  selector: 'app-timetable-entry-card',
  standalone: true,
  imports: [NgIcon],
  viewProviders: [provideIcons({ heroPencil, heroTrash })],
  templateUrl: './timetable-entry-card.component.html',
})
export class TimetableEntryCardComponent {
  entry = input.required<TimetableEntry>();
  showPerson = input<boolean>(false);
  canEdit = input<boolean>(false);
  inlinedActions = input<boolean>(false);

  editRequested = output<TimetableEntry>();
  deleteRequested = output<TimetableEntry>();
}
