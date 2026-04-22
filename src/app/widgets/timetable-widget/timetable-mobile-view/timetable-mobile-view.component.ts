import { Component, input, output } from '@angular/core';
import { TimetableEntry } from '../../../interfaces/timetable';
import { TimetableEntryCardComponent } from '../timetable-entry-card/timetable-entry-card.component';

const ALL_PERSONS = '__all__';

@Component({
  selector: 'app-timetable-mobile-view',
  standalone: true,
  imports: [TimetableEntryCardComponent],
  templateUrl: './timetable-mobile-view.component.html',
})
export class TimetableMobileViewComponent {
  entriesByDay = input.required<Record<number, TimetableEntry[]>>();
  weekdays = input.required<readonly string[]>();
  selectedDay = input.required<number>();
  selectedPerson = input.required<string>();
  canEdit = input<boolean>(false);

  daySelected = output<number>();
  editEntry = output<TimetableEntry>();
  deleteEntry = output<TimetableEntry>();

  readonly ALL_PERSONS = ALL_PERSONS;
}
