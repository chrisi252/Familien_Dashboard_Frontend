import { Component, effect, input, output, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { heroCheck, heroXMark } from '@ng-icons/heroicons/outline';
import { FamilyMember } from '../../../interfaces/user';
import {
  TimetableEntry,
  TimetableEntryCreate,
  TimetablePerson,
  WEEKDAY_LABELS,
} from '../../../interfaces/timetable';
import { ModalComponent } from '../../../shared/modal/modal.component';

const DEFAULT_COLORS = [
  '#3B82F6', '#EF4444', '#10B981', '#F59E0B',
  '#8B5CF6', '#EC4899', '#14B8A6', '#F97316',
];

@Component({
  selector: 'app-timetable-form',
  standalone: true,
  imports: [FormsModule, NgIcon, ModalComponent],
  viewProviders: [provideIcons({ heroCheck, heroXMark })],
  templateUrl: './timetable-form.component.html',
})
export class TimetableFormComponent {
  familyMembers = input.required<FamilyMember[]>();
  persons = input.required<TimetablePerson[]>();
  editingEntry = input<TimetableEntry | null>(null);
  initialForm = input.required<TimetableEntryCreate>();

  saved = output<TimetableEntryCreate>();
  cancelled = output<void>();

  readonly weekdays = WEEKDAY_LABELS;

  form = signal<TimetableEntryCreate>({
    person_name: '',
    color: DEFAULT_COLORS[0],
    weekday: 0,
    start_time: '08:00',
    end_time: '08:45',
    subject: '',
    room: null,
    teacher: null,
    note: null,
  });

  constructor() {
    effect(() => {
      this.form.set(this.initialForm());
    });
  }

  patchForm(patch: Partial<TimetableEntryCreate>) {
    if (patch.person_name !== undefined) {
      const known = this.persons().find((p) => p.person_name === patch.person_name);
      if (known) {
        this.form.set({ ...this.form(), ...patch, color: known.color });
        return;
      }
      const memberIndex = this.familyMembers().findIndex(
        (m) => m.user_username === patch.person_name,
      );
      if (memberIndex >= 0) {
        this.form.set({
          ...this.form(),
          ...patch,
          color: DEFAULT_COLORS[memberIndex % DEFAULT_COLORS.length],
        });
        return;
      }
    }
    this.form.set({ ...this.form(), ...patch });
  }
}
