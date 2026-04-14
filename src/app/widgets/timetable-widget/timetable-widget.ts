import {
  Component,
  computed,
  DestroyRef,
  inject,
  input,
  OnInit,
  signal,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { heroPlus, heroPencil, heroTrash, heroXMark, heroCheck } from '@ng-icons/heroicons/outline';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { switchMap } from 'rxjs';
import { TimetableService } from '../../services/timetable-service';
import { UserStateService } from '../../services/user-state-service';
import {
  TimetableEntry,
  TimetableEntryCreate,
  TimetablePerson,
  WEEKDAY_LABELS,
} from '../../interfaces/timetable';

const DEFAULT_COLORS = [
  '#3B82F6', '#EF4444', '#10B981', '#F59E0B',
  '#8B5CF6', '#EC4899', '#14B8A6', '#F97316',
];

@Component({
  selector: 'app-timetable-widget',
  imports: [FormsModule, NgIcon],
  viewProviders: [provideIcons({ heroPlus, heroPencil, heroTrash, heroXMark, heroCheck })],
  templateUrl: './timetable-widget.html',
  styleUrl: './timetable-widget.css',
})
export class TimetableWidget implements OnInit {
  private timetableService = inject(TimetableService);
  private userState = inject(UserStateService);
  private destroyRef = inject(DestroyRef);

  widgetId = input<number>(0);
  canEdit = input<boolean>(false);

  private familyId: number | null = null;

  persons = signal<TimetablePerson[]>([]);
  selectedPerson = signal<string | null>(null);
  entries = signal<TimetableEntry[]>([]);

  isLoading = signal(true);
  isLoadingEntries = signal(false);
  errorMessage = signal('');

  showAddForm = signal(false);
  editingEntry = signal<TimetableEntry | null>(null);

  readonly weekdays = WEEKDAY_LABELS;

  entriesByDay = computed(() => {
    const result: Record<number, TimetableEntry[]> = { 0: [], 1: [], 2: [], 3: [], 4: [] };
    for (const entry of this.entries()) {
      result[entry.weekday].push(entry);
    }
    for (const day of Object.keys(result)) {
      result[+day].sort((a, b) => a.start_time.localeCompare(b.start_time));
    }
    return result;
  });

  // Form state
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

  ngOnInit() {
    this.userState
      .resolveCurrentFamilyId$()
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        switchMap((id) => {
          this.familyId = id;
          return this.timetableService.getPersons(id);
        }),
      )
      .subscribe({
        next: (res) => {
          this.persons.set(res.persons);
          this.isLoading.set(false);
          if (res.persons.length > 0) {
            this.selectPerson(res.persons[0].person_name);
          }
        },
        error: () => {
          this.errorMessage.set('Stundenplan konnte nicht geladen werden.');
          this.isLoading.set(false);
        },
      });
  }

  selectPerson(name: string) {
    if (!this.familyId) return;
    this.selectedPerson.set(name);
    this.isLoadingEntries.set(true);
    this.timetableService
      .getEntries(this.familyId, name)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (res) => {
          this.entries.set(res.entries);
          this.isLoadingEntries.set(false);
        },
        error: () => this.isLoadingEntries.set(false),
      });
  }

  openAddForm() {
    const person = this.selectedPerson();
    const color = person
      ? (this.persons().find((p) => p.person_name === person)?.color ?? DEFAULT_COLORS[0])
      : DEFAULT_COLORS[0];

    this.form.set({
      person_name: person ?? '',
      color,
      weekday: 0,
      start_time: '08:00',
      end_time: '08:45',
      subject: '',
      room: null,
      teacher: null,
      note: null,
    });
    this.editingEntry.set(null);
    this.showAddForm.set(true);
  }

  openEditForm(entry: TimetableEntry) {
    this.form.set({
      person_name: entry.person_name,
      color: entry.color,
      weekday: entry.weekday,
      start_time: entry.start_time,
      end_time: entry.end_time,
      subject: entry.subject,
      room: entry.room,
      teacher: entry.teacher,
      note: entry.note,
    });
    this.editingEntry.set(entry);
    this.showAddForm.set(true);
  }

  closeForm() {
    this.showAddForm.set(false);
    this.editingEntry.set(null);
  }

  saveEntry() {
    if (!this.familyId) return;
    const f = this.form();
    if (!f.subject.trim() || !f.person_name.trim()) return;

    const editing = this.editingEntry();
    if (editing) {
      this.timetableService
        .updateEntry(this.familyId, editing.id, f)
        .pipe(takeUntilDestroyed(this.destroyRef))
        .subscribe({
          next: (updated) => {
            this.entries.set(this.entries().map((e) => (e.id === updated.id ? updated : e)));
            this.refreshPersons();
            this.closeForm();
          },
        });
    } else {
      this.timetableService
        .createEntry(this.familyId, f)
        .pipe(takeUntilDestroyed(this.destroyRef))
        .subscribe({
          next: (created) => {
            // If this is a new person, add them to the list
            if (!this.persons().find((p) => p.person_name === created.person_name)) {
              this.persons.set([
                ...this.persons(),
                { person_name: created.person_name, color: created.color },
              ]);
            }
            if (this.selectedPerson() === created.person_name) {
              this.entries.set([...this.entries(), created]);
            } else {
              this.selectPerson(created.person_name);
            }
            this.closeForm();
          },
        });
    }
  }

  deleteEntry(entry: TimetableEntry) {
    if (!this.familyId) return;
    this.timetableService
      .deleteEntry(this.familyId, entry.id)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: () => {
          const remaining = this.entries().filter((e) => e.id !== entry.id);
          this.entries.set(remaining);
          this.refreshPersons();
        },
      });
  }

  patchForm(patch: Partial<TimetableEntryCreate>) {
    this.form.set({ ...this.form(), ...patch });
  }

  private refreshPersons() {
    if (!this.familyId) return;
    this.timetableService
      .getPersons(this.familyId)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({ next: (res) => this.persons.set(res.persons) });
  }
}
