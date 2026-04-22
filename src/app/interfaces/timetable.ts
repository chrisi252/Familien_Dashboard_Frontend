export interface TimetableEntry {
  id: number;
  family_id: number;
  person_name: string;
  color: string;
  weekday: number; // 0=Mo, 1=Di, 2=Mi, 3=Do, 4=Fr
  start_time: string; // HH:MM
  end_time: string;   // HH:MM
  subject: string;
  room: string | null;
  teacher: string | null;
  note: string | null;
  created_at: string;
  updated_at: string;
}

export interface TimetablePerson {
  person_name: string;
  color: string;
}

export interface TimetableEntryCreate {
  person_name: string;
  color: string;
  weekday: number;
  start_time: string;
  end_time: string;
  subject: string;
  room?: string | null;
  teacher?: string | null;
  note?: string | null;
}

export interface TimetableEntryUpdate {
  person_name?: string;
  color?: string;
  weekday?: number;
  start_time?: string;
  end_time?: string;
  subject?: string;
  room?: string | null;
  teacher?: string | null;
  note?: string | null;
}

export const WEEKDAY_LABELS = ['Mo', 'Di', 'Mi', 'Do', 'Fr'] as const;

export const TIMETABLE_PERSON_COLORS = [
  '#3B82F6', '#EF4444', '#10B981', '#F59E0B',
  '#8B5CF6', '#EC4899', '#14B8A6', '#F97316',
] as const;

export const TIMETABLE_ALL_PERSONS = '__all__';
