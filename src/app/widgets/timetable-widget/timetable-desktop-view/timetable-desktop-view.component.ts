import { Component, input, output } from '@angular/core';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { heroPencil, heroTrash } from '@ng-icons/heroicons/outline';
import { TimetableEntry } from '../../../interfaces/timetable';

const ALL_PERSONS = '__all__';

@Component({
  selector: 'app-timetable-desktop-view',
  standalone: true,
  imports: [NgIcon],
  viewProviders: [provideIcons({ heroPencil, heroTrash })],
  templateUrl: './timetable-desktop-view.component.html',
})
export class TimetableDesktopViewComponent {
  entriesByDay = input.required<Record<number, TimetableEntry[]>>();
  weekdays = input.required<readonly string[]>();
  selectedPerson = input.required<string>();
  canEdit = input<boolean>(false);

  editEntry = output<TimetableEntry>();
  deleteEntry = output<TimetableEntry>();

  readonly ALL_PERSONS = ALL_PERSONS;
}
