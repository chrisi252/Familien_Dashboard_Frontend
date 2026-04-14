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
import { forkJoin, of, switchMap, take } from 'rxjs';
import { TimetableService } from '../../services/timetable-service';
import { UserStateService } from '../../services/user-state-service';
import { FamilyService } from '../../services/family-service';
import { FamilyMember } from '../../interfaces/user';
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

const ALL_PERSONS = '__all__';

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
  private familyService = inject(FamilyService);
  private destroyRef = inject(DestroyRef);

  widgetId = input<number>(0);
  canEdit = input<boolean>(false);

  private familyId: number | null = null;

  familyMembers = signal<FamilyMember[]>([]);
  persons = signal<TimetablePerson[]>([]);
  selectedPerson = signal<string>(ALL_PERSONS);
  entries = signal<TimetableEntry[]>([]);

  isLoading = signal(true);
  isLoadingEntries = signal(false);
  errorMessage = signal('');
  showDeletePersonConfirm = signal<string | null>(null);

  showAddForm = signal(false);
  editingEntry = signal<TimetableEntry | null>(null);

  /** Aktiv ausgewählter Tag in der mobilen Ansicht (0=Mo … 4=Fr) */
  selectedDay = signal(0);

  readonly weekdays = WEEKDAY_LABELS;
  readonly ALL_PERSONS = ALL_PERSONS;

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

  selectedDayEntries = computed(() => this.entriesByDay()[this.selectedDay()] ?? []);

  personColor(username: string): string {
    return this.persons().find((p) => p.person_name === username)?.color
      ?? DEFAULT_COLORS[this.familyMembers().findIndex((m) => m.user_username === username) % DEFAULT_COLORS.length]
      ?? '#6B7280';
  }

  personHasEntries(username: string): boolean {
    return this.persons().some((p) => p.person_name === username);
  }

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

    if (name === ALL_PERSONS) {
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

  openAddForm() {
    const person = this.selectedPerson() === ALL_PERSONS ? null : this.selectedPerson();
    const color = person
      ? (this.persons().find((p) => p.person_name === person)?.color ?? DEFAULT_COLORS[0])
      : DEFAULT_COLORS[0];

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
            if (!this.persons().find((p) => p.person_name === created.person_name)) {
              this.persons.set([
                ...this.persons(),
                { person_name: created.person_name, color: created.color },
              ]);
            }
            if (
              this.selectedPerson() === ALL_PERSONS ||
              this.selectedPerson() === created.person_name
            ) {
              this.entries.set([...this.entries(), created]);
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
          this.entries.set(this.entries().filter((e) => e.id !== entry.id));
          this.refreshPersons();
        },
      });
  }

  /** Alle Einträge einer Person löschen */
  deleteAllEntriesForPerson(personName: string) {
    if (!this.familyId) return;
    this.showDeletePersonConfirm.set(null);

    const deleteFromCurrent = () => {
      const toDelete = this.entries().filter((e) => e.person_name === personName);
      if (toDelete.length === 0) {
        this.persons.set(this.persons().filter((p) => p.person_name !== personName));
        this.selectPerson(ALL_PERSONS);
        return;
      }
      forkJoin(toDelete.map((e) => this.timetableService.deleteEntry(this.familyId!, e.id)))
        .pipe(takeUntilDestroyed(this.destroyRef))
        .subscribe({
          next: () => {
            this.entries.set(this.entries().filter((e) => e.person_name !== personName));
            this.persons.set(this.persons().filter((p) => p.person_name !== personName));
            this.selectPerson(ALL_PERSONS);
          },
        });
    };

    // Wenn die Person gerade ausgewählt ist oder alle geladen sind, haben wir die Daten bereits
    if (
      this.selectedPerson() === personName ||
      this.selectedPerson() === ALL_PERSONS
    ) {
      deleteFromCurrent();
    } else {
      // Einträge erst laden, dann löschen
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

  patchForm(patch: Partial<TimetableEntryCreate>) {
    if (patch.person_name !== undefined) {
      const known = this.persons().find((p) => p.person_name === patch.person_name);
      if (known) {
        this.form.set({ ...this.form(), ...patch, color: known.color });
        return;
      }
      // Farbe aus DEFAULT_COLORS basierend auf Familymember-Index
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

  private refreshPersons() {
    if (!this.familyId) return;
    this.timetableService
      .getPersons(this.familyId)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (res) => {
          this.persons.set(res.persons);
          if (this.selectedPerson() === ALL_PERSONS) {
            this.loadAllEntries();
          }
        },
      });
  }
}
