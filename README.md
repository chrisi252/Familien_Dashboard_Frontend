# Familiendashboard — Frontend

Web-basiertes Familien-Dashboard (SPA) mit konfigurierbaren Widgets für Stundenplan, Wetter und To-Dos. Rollenkonzept (System-Admin / Familien-Admin / Nutzer), Drag-&-Drop-Layout und Mobile-First-UI.

Akademisches Projekt im Kurs **WWI24 SEA**.

---

## Tech-Stack

- **Framework:** Angular 21 (Standalone Components, Signals, Functional Guards)
- **Sprache:** TypeScript 5.9 (strict)
- **Styling:** Tailwind CSS 4 + DaisyUI 5
- **Drag & Drop:** Angular CDK
- **Runtime/Deploy:** Docker, Nginx 1.27-alpine
- **Tests:** Vitest

---

## Projektstruktur

```
src/
├── app/
│   ├── core/                  # ApiService, API-Base-URL-Token
│   ├── guards/                # authGuard, familyAdminGuard, systemAdminGuard
│   ├── services/              # Domain-Services (Auth, UserState, Dashboard, …)
│   ├── interfaces/            # TypeScript-Interfaces / DTOs
│   ├── shared/                # Alert-Banner, Loading-State, Modal
│   ├── directives/            # auto-animate
│   ├── components/            # Feature-Komponenten (Dashboard, Admin, Login, …)
│   └── widgets/               # Widget-Implementierungen (todo, weather, timetable)
├── environments/              # env.ts / env.production.ts
└── main.ts
```

Architekturdetails (C4, Design-Entscheidungen): siehe [`docs/`](./docs).

---

## Lokales Setup

### Voraussetzungen
- Node.js **24.x** (im Dockerfile gepinnt auf `node:24.12.0-alpine`)
- npm **11.x**
- Backend erreichbar unter `http://localhost:5000` (oder via `BACKEND_URL` konfiguriert)

### Installation & Start
```bash
npm ci
npm start
# App: http://localhost:4200
```

Der Dev-Server proxied Requests auf `/api` an das Backend (siehe `proxy.conf.js`).
Standardziel: `http://localhost:5000` — überschreibbar per Env-Variable `BACKEND_URL`.

### Tests
```bash
npm test       # Unit-Tests (Vitest)
```

### Production-Build
```bash
npm run build
# Output: dist/familiendashboard/browser
```

---

## Docker

### Production-Image (Nginx + gebaute SPA)
```bash
docker build --target production -t familiendashboard-frontend .
docker run --rm -p 8080:80 familiendashboard-frontend
# App: http://localhost:8080
```

### Development-Image (Live-Reload)
```bash
docker build --target dev -t familiendashboard-frontend:dev .
docker run --rm -p 4200:4200 -v "$(pwd):/app" familiendashboard-frontend:dev
```

### Docker Compose
```bash
docker-compose up
```

---

## Environment-Konfiguration

Die API-Base-URL wird **zur Laufzeit** aus `window.__env.API_URL` gelesen
(Fallback: `/api`, siehe `src/environments/environment.ts`). Damit kann das
gleiche Production-Image in verschiedenen Umgebungen mit unterschiedlichen
Backend-URLs betrieben werden, ohne neu gebaut zu werden.

Variablen für den Dev-Server stehen in `.env` (nicht ins Git einchecken).
Vorlage: [`.env.example`](./.env.example).

| Variable      | Zweck                                   | Default                         |
|---------------|-----------------------------------------|---------------------------------|
| `BACKEND_URL` | Proxy-Ziel des Angular-Dev-Servers      | `http://localhost:5000`         |
| `window.__env.API_URL` (Runtime) | API-Base-URL im Browser | `/api` (Fallback)               |

---

## Rollenkonzept

| Rolle            | Zugriff / UI                                                                 |
|------------------|------------------------------------------------------------------------------|
| **SystemAdmin**  | Verwaltung aller Familien & Accounts (`/systemadmin`)                        |
| **FamilyAdmin**  | Widget-, Mitglieder- und Layout-Verwaltung der eigenen Familie (`/familyadmin`) |
| **Nutzer (Guest)** | Dashboard ansehen/bedienen, eigenes Layout anpassen (`/dashboard`)         |

Routen werden per Functional Guards (`authGuard`, `familyAdminGuard`,
`systemAdminGuard`) geschützt. Das Frontend prüft zusätzlich pro Widget die
`canEdit`-Flag aus der Backend-Response und blendet Mutations-Buttons
entsprechend aus.

---

## Widget-System erweitern

Neue Widgets werden **zentral registriert** — der Widget-Container muss nicht
angepasst werden:

1. Neue Component unter `src/app/widgets/<name>-widget/` anlegen.
2. In `src/app/services/dashboard-service.ts` die `WIDGET_REGISTRY` um einen
   Eintrag ergänzen:
   ```ts
   notes: { content: NotesWidget, label: 'Notizen', defaultRows: 2, defaultCols: 1 },
   ```
3. Backend muss einen passenden `widget_key` liefern.

Die Komponente erhält per `NgComponentOutletInputs` automatisch:
- `widgetId: number`
- `canEdit: boolean`

---

## Weiterführende Dokumentation

- [Benutzerhandbuch](./docs/user-guide.md) — Anleitung für Endnutzer
- [Architektur & Design-Entscheidungen](./docs/architecture.md) *(TODO)*
- [KI-Nutzung](./docs/ai-usage.md) *(TODO)*
- [Beitragsdokument](./docs/contributions.md) *(TODO)*

---

## Lizenz

Siehe [`LICENSE`](./LICENSE) *(noch nicht vorhanden)*.
