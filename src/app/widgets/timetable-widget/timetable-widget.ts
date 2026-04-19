import {
  ChangeDetectionStrategy,
  Component,
  computed,
  DestroyRef,
  inject,
  input,
  OnInit,
  signal,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { forkJoin, switchMap, take } from 'rxjs';
import { TimetableService } from '../../services/timetable-service';
import { UserStateService } from '../../services/user-state-service';
import { FamilyService } from '../../services/family-service';
import { FamilyMember } from '../../interfaces/user';
import {
  TIMETABLE_ALL_PERSONS,
  TIMETABLE_PERSON_COLORS,
  TimetableEntry,
  TimetableEntryCreate,
  TimetablePerson,
  WEEKDAY_LABELS,
} from '../../interfaces/timetable';
import { LoadingStateComponent } from '../../shared/loading-state/loading-state.component';
import { TimetablePersonTabsComponent } from './timetable-person-tabs/timetable-person-tabs.component';
import { TimetableMobileViewComponent } from './timetable-mobile-view/timetable-mobile-view.component';
import { TimetableDesktopViewComponent } from './timetable-desktop-view/timetable-desktop-view.component';
import { TimetableFormComponent } from './timetable-form/timetable-form.component';

@Component({
  selector: 'app-timetable-widget',
  standalone: true,
  imports: [
    LoadingStateComponent,
    TimetablePersonTabsComponent,
    TimetableMobileViewComponent,
    TimetableDesktopViewComponent,
    TimetableFormComponent,
  ],
  templateUrl: './timetable-widget.html',
  styleUrl: './timetable-widget.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TimetableWidget implements OnInit {
  private timetableService = inject(TimetableService);
  private userState = inject(UserStateService);
  private familyService = inject(FamilyService);
  private destroyRef = inject(DestroyRef);

  widgetId = input<number>(0);
  canEdit = input<boolean>(false);

  private familyId: number | null = null;

  familyMembers = signal<FamilyMember[]>([]);
  persons = signal<TimetablePerson[]>([]);
  selectedPerson = signal<string>(TIMETABLE_ALL_PERSONS);
  entries = signal<TimetableEntry[]>([]);

  isLoading = signal(true);
  isLoadingEntries = signal(false);
  errorMessage = signal('');
  showDeletePersonConfirm = signal<string | null>(null);

  showAddForm = signal(false);
  editingEntry = signal<TimetableEntry | null>(null);

  selectedDay = signal(0);

  readonly weekdays = WEEKDAY_LABELS;
  readonly ALL_PERSONS = TIMETABLE_ALL_PERSONS;

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

  form = signal<TimetableEntryCreate>({
    person_name: '',
    color: TIMETABLE_PERSON_COLORS[0],
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
        take(1),
        takeUntilDestroyed(this.destroyRef),
        switchMap((id) => {
          this.familyId = id;
          return forkJoin({
            members: this.familyService.getFamilyById(id),
            persons: this.timetableService.getPersons(id),
          });
        }),
      )
      .subscribe({
        next: ({ members, persons }) => {
          this.familyMembers.set(members.members);
          this.persons.set(persons.persons);
          this.isLoading.set(false);
          this.loadAllEntries();
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
    this.showDeletePersonConfirm.set(null);

    if (name === TIMETABLE_ALL_PERSONS) {
      this.loadAllEntries();
    } else {
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
  }

  openAddForm() {
    const person = this.selectedPerson() === TIMETABLE_ALL_PERSONS ? null : this.selectedPerson();
    const color = person
      ? (this.persons().find((p) => p.person_name === person)?.color ?? TIMETABLE_PERSON_COLORS[0])
      : TIMETABLE_PERSON_COLORS[0];

    this.form.set({
      person_name: person ?? (this.familyMembers()[0]?.user_username ?? ''),
      color,
      weekday: this.selectedDay(),
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

  saveEntry(formValue: TimetableEntryCreate) {
    if (!this.familyId) return;
    if (!formValue.subject.trim() || !formValue.person_name.trim()) return;

    const editing = this.editingEntry();
    if (editing) {
      this.timetableService
        .updateEntry(this.familyId, editing.id, formValue)
        .pipe(takeUntilDestroyed(this.destroyRef))
        .subscribe({
          next: (updated) => {
            this.entries.set(this.entries().map((e) => (e.id === updated.id ? updated : e)));
            this.refreshPersons();
            this.closeForm();
          },
          error: () => this.errorMessage.set('Eintrag konnte nicht aktualisiert werden.'),
        });
    } else {
      this.timetableService
        .createEntry(this.familyId, formValue)
        .pipe(takeUntilDestroyed(this.destroyRef))
        .subscribe({
          next: (created) => {
            if (!this.persons().find((p) => p.person_name === created.person_name)) {
              this.persons.set([
                ...this.persons(),
                { person_name: created.person_name, color: created.color },
              ]);
            }
            if (
              this.selectedPerson() === TIMETABLE_ALL_PERSONS ||
              this.selectedPerson() === created.person_name
            ) {
              this.entries.set([...this.entries(), created]);
            }
            this.closeForm();
          },
          error: () => this.errorMessage.set('Eintrag konnte nicht erstellt werden.'),
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
          this.entries.set(this.entries().filter((e) => e.id !== entry.id));
          this.refreshPersons();
        },
        error: () => this.errorMessage.set('Eintrag konnte nicht gelöscht werden.'),
      });
  }

  deleteAllEntriesForPerson(personName: string) {
    if (!this.familyId) return;
    this.showDeletePersonConfirm.set(null);

    const deleteFromCurrent = () => {
      const toDelete = this.entries().filter((e) => e.person_name === personName);
      if (toDelete.length === 0) {
        this.persons.set(this.persons().filter((p) => p.person_name !== personName));
        this.selectPerson(TIMETABLE_ALL_PERSONS);
        return;
      }
      forkJoin(toDelete.map((e) => this.timetableService.deleteEntry(this.familyId!, e.id)))
        .pipe(takeUntilDestroyed(this.destroyRef))
        .subscribe({
          next: () => {
            this.entries.set(this.entries().filter((e) => e.person_name !== personName));
            this.persons.set(this.persons().filter((p) => p.person_name !== personName));
            this.selectPerson(TIMETABLE_ALL_PERSONS);
          },
          error: () => this.errorMessage.set('Einträge konnten nicht gelöscht werden.'),
        });
    };

    if (
      this.selectedPerson() === personName ||
      this.selectedPerson() === TIMETABLE_ALL_PERSONS
    ) {
      deleteFromCurrent();
    } else {
      this.timetableService
        .getEntries(this.familyId, personName)
        .pipe(takeUntilDestroyed(this.destroyRef))
        .subscribe({
          next: (res) => {
            this.entries.set([...this.entries(), ...res.entries]);
            deleteFromCurrent();
          },
        });
    }
  }

  private loadAllEntries() {
    if (!this.familyId) return;
    const allPersons = this.persons();
    if (allPersons.length === 0) {
      this.entries.set([]);
      return;
    }

    this.isLoadingEntries.set(true);
    const requests = allPersons.map((p) =>
      this.timetableService.getEntries(this.familyId!, p.person_name),
    );

    forkJoin(requests)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (results) => {
          const combined = results.flatMap((r) => r.entries);
          this.entries.set(combined);
          this.isLoadingEntries.set(false);
        },
        error: () => this.isLoadingEntries.set(false),
      });
  }

  private refreshPersons() {
    if (!this.familyId) return;
    this.timetableService
      .getPersons(this.familyId)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (res) => {
          this.persons.set(res.persons);
          if (this.selectedPerson() === TIMETABLE_ALL_PERSONS) {
            this.loadAllEntries();
          }
        },
      });
  }
}
