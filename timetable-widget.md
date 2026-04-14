# Stundenplan-Widget — Frontend-Einweisung

## Konzept

- Es gibt **keine separaten Kind-Objekte** im Backend. Kinder sind einfach `person_name`-Strings.
- Jede Person hat eine `color` (Hex, z.B. `#EF4444`), die auf **jedem Eintrag** dieser Person gespeichert ist.
- Das Frontend zeigt immer **einen Stundenplan auf einmal** — der User wählt die Person per Dropdown/Tab.
- Einträge haben `weekday` (0=Mo bis 4=Fr) und `start_time`/`end_time` im Format `HH:MM`.

---

## API-Übersicht

Basis-URL: `/api/families/{family_id}/timetable`

| Methode | Pfad                              | Beschreibung                          | Berechtigung |
|---------|-----------------------------------|---------------------------------------|--------------|
| GET     | `/persons`                        | Alle Personen (Name + Farbe)          | can_view     |
| GET     | `/{person_name}/entries`          | Alle Einträge einer Person            | can_view     |
| POST    | `/entries`                        | Neuen Eintrag erstellen               | can_edit     |
| PUT     | `/entries/{entry_id}`             | Eintrag aktualisieren (partial)       | can_edit     |
| DELETE  | `/entries/{entry_id}`             | Eintrag löschen                       | can_edit     |

---

## Typisches Render-Flow

```
1. GET /api/families/{id}/timetable/persons
   → Liste aller Personen mit Farbe → Dropdown/Tabs befüllen

2. User wählt Person (z.B. "Emma")
   → GET /api/families/{id}/timetable/Emma/entries
   → Einträge nach weekday gruppieren → Wochentabelle rendern
```

---

## Datenstruktur `TimetableEntry`

```ts
interface TimetableEntry {
  id: number
  family_id: number
  person_name: string
  color: string          // Hex, z.B. "#EF4444"
  weekday: number        // 0=Mo, 1=Di, 2=Mi, 3=Do, 4=Fr
  start_time: string     // "HH:MM"
  end_time: string       // "HH:MM"
  subject: string
  room: string | null
  teacher: string | null
  note: string | null
  created_at: string
  updated_at: string
}

interface TimetablePerson {
  person_name: string
  color: string
}
```

---

## Beispiel: Neuen Eintrag anlegen (POST)

```json
{
  "person_name": "Emma",
  "color": "#EF4444",
  "weekday": 0,
  "start_time": "08:00",
  "end_time": "08:45",
  "subject": "Mathematik",
  "room": "101",
  "teacher": "Herr Müller",
  "note": null
}
```

**Pflichtfelder:** `person_name`, `color`, `weekday`, `start_time`, `end_time`, `subject`

**Validierungsregeln (Backend):**
- `weekday`: 0–4 (kein Wochenende)
- `start_time`/`end_time`: Format `HH:MM`, start muss vor end liegen
- `color`: gültiger Hex-Wert `#RRGGBB`

---

## Beispiel: Eintrag aktualisieren (PUT)

Nur geänderte Felder senden — alle anderen bleiben unverändert:

```json
{
  "room": "103",
  "subject": "Mathematik (Klasse 5)"
}
```

---

## Empfohlener UI-Aufbau

```
┌─────────────────────────────────────────┐
│ Stundenplan  [Emma ▼] [Leon]            │  ← Personen-Tabs/Dropdown
├──────┬──────┬──────┬──────┬─────────────┤
│  Mo  │  Di  │  Mi  │  Do  │  Fr         │
├──────┼──────┼──────┼──────┼─────────────┤
│ 08:00│      │      │      │             │
│ Math │      │      │      │             │  ← Einträge als farbige Karten
│ R101 │      │      │      │             │
├──────┼──────┼──────┼──────┼─────────────┤
│      │ 09:00│      │      │             │
│      │ Dt.  │      │      │             │
└──────┴──────┴──────┴──────┴─────────────┘
```

- Spalten: Wochentage (Mo–Fr), Zeilen: Zeitslots
- Eintragsfarbe = `entry.color` (kommt vom Backend)
- `can_edit` aus dem Widget-Objekt steuert ob "Hinzufügen/Bearbeiten"-Buttons sichtbar sind

---

## Farbkonsistenz

Da `color` auf jedem Eintrag liegt (kein separates Person-Objekt):
- Beim **Erstellen des ersten Eintrags** einer neuen Person: User wählt die Farbe, Frontend speichert sie auf dem Eintrag.
- Beim **Erstellen weiterer Einträge** derselben Person: `color` aus `GET /persons` vorbelegen, damit alle Einträge dieselbe Farbe haben.
- Beim **Umbenennen einer Person** oder **Farbänderung**: alle Einträge dieser Person per PUT einzeln aktualisieren.

---

## Berechtigungen

Das Widget nutzt das Standard-Berechtigungssystem. Aus `GET /api/families/{id}/widgets` kommt:

```json
{
  "widget_key": "timetable",
  "can_edit": true
}
```

- `can_edit: false` → Nur Lesemodus, keine Hinzufügen/Bearbeiten/Löschen-Buttons zeigen.
- `can_edit: true` → Volle Bearbeitungsmöglichkeiten.

---

# Systemadministrator

## Konzept

- Ein Systemadmin-Account hat `is_system_admin: true` im User-Objekt.
- `is_system_admin` wird bei **Login und Registrierung** im Response mitgeliefert.
- Systemadmins sind **keine Familienmitglieder** — sie verwalten das System, nicht den Familien-Content.
- Der initiale Admin-Account wird automatisch beim App-Start aus den Umgebungsvariablen angelegt.

## Erkennungsmerkmal beim Login

```json
{
  "message": "Login successful",
  "user": {
    "id": 25,
    "username": "admin",
    "is_system_admin": true,
    ...
  },
  "families": []
}
```

→ Wenn `user.is_system_admin === true`: Admin-Bereich anzeigen statt normales Dashboard.

## Admin-API

Basis-URL: `/api/admin`

| Methode | Pfad          | Beschreibung                        |
|---------|---------------|-------------------------------------|
| GET     | `/families`   | Alle Familien auflisten             |
| POST    | `/accounts`   | Neuen Systemadmin-Account erstellen |

Beide Routen erfordern einen eingeloggten Systemadmin (Cookie + `is_system_admin=true`). Bei fehlendem Zugriff kommt `403`.

## TypeScript-Interface

```ts
interface User {
  id: number
  username: string
  first_name: string
  last_name: string
  is_active: boolean
  is_system_admin: boolean   // NEU — immer im Response enthalten
  created_at: string
}
```

## Beispiel: Neuen Admin anlegen (POST /api/admin/accounts)

```json
{
  "username": "admin2",
  "password": "Admin5678!",
  "first_name": "Zweiter",
  "last_name": "Admin"
}
```

Response (201):
```json
{
  "message": "Admin-Account erstellt",
  "user": {
    "id": 28,
    "username": "admin2",
    "is_system_admin": true,
    ...
  }
}
```

---

# Einladungscodes (Invite Codes)

## Konzept

- Ein **Familyadmin** generiert einen 6-stelligen Einladungscode für seine Familie.
- Der Code ist **2 Minuten gültig** und ersetzt einen eventuell vorhandenen alten Code.
- Andere eingeloggte User können mit dem Code der Familie beitreten (als Guest-Rolle).
- Code ist case-insensitive (wird im Backend zu Uppercase konvertiert).
- Zeichen: `A-Z, 2-9` (ohne 0/O/I/1 um Verwechslungen zu vermeiden).

## API

| Methode | Pfad                                         | Beschreibung                    | Berechtigung     |
|---------|----------------------------------------------|---------------------------------|------------------|
| POST    | `/api/families/{family_id}/invite-code`      | Einladungscode generieren       | Familyadmin      |
| POST    | `/api/families/join-by-code`                 | Familie per Code beitreten      | Eingeloggt       |

## TypeScript-Interface

```ts
interface FamilyInviteCode {
  id: number
  family_id: number
  code: string         // 6 Zeichen, z.B. "X7K2BN"
  created_at: string
  expires_at: string   // 2 Minuten nach created_at
}
```

## Flow

```
1. Familyadmin klickt "Einladungscode generieren"
   → POST /api/families/{id}/invite-code
   → Response: { code: "X7K2BN", expires_at: "2026-04-12T14:11:23..." }
   → Code + Countdown anzeigen (2 min)

2. Neuer User gibt Code ein
   → POST /api/families/join-by-code { "code": "X7K2BN" }
   → Erfolg: UserFamilyRole-Objekt (role_name: "Guest")
   → Fehler: "Ungültiger Einladungscode" oder "Der Einladungscode ist abgelaufen"
```

## Beispiel: Code generieren (POST)

Response (201):
```json
{
  "id": 1,
  "family_id": 12,
  "code": "X7K2BN",
  "created_at": "2026-04-12T14:09:23.447066",
  "expires_at": "2026-04-12T14:11:23.446346"
}
```

## Beispiel: Beitreten (POST)

Request:
```json
{ "code": "X7K2BN" }
```

Response (200):
```json
{
  "id": 17,
  "user_id": 29,
  "family_id": 12,
  "role_id": 2,
  "role_name": "Guest",
  "user_username": "joiner_test"
}
```

## Fehlerfälle

| Code | Fehler                                   |
|------|------------------------------------------|
| 400  | `Einladungscode ist erforderlich`        |
| 400  | `Ungültiger Einladungscode`              |
| 400  | `Der Einladungscode ist abgelaufen`      |
| 400  | `User is already member of this family`  |
| 403  | `Nur der Familienadmin hat Zugriff`      |

## UI-Empfehlung

- **Admin-Seite:** Button "Code generieren" → Code groß anzeigen + Countdown-Timer (2 min)
- **Join-Seite:** Textfeld für 6-stelligen Code + "Beitreten"-Button
- Code-Eingabe: Uppercase erzwingen, maxLength=6
