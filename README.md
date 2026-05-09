# Familiendashboard — Frontend

Web-basiertes Familien-Dashboard (SPA) mit konfigurierbaren Widgets für Stundenplan, Live-Chat, Wetter und To-Dos. Rollenkonzept (System-Admin / Familien-Admin / Nutzer).

Akademisches Projekt im Kurs **WWI24 SEA**.

---

## Tech-Stack

- **Framework:** Angular 21 (Standalone Components, Signals, Functional Guards)
- **Sprache:** TypeScript 5.9 (strict)
- **Styling:** Tailwind CSS 4 + DaisyUI 5
- **Runtime/Deploy:** Docker, Nginx 1.27-alpine

---

## Projektstruktur

```
src/
├── app/
│   ├── core/                  # ApiService, API-Konfiguration
│   ├── guards/                # Auth-, FamilyAdmin-, SystemAdmin-Guards
│   ├── services/              # Auth, Dashboard, Family, Theme, Chat, Weather, …
│   ├── interfaces/            # DTOs (User, Family, Widget, Chat, …)
│   ├── shared/                # Alert-Banner, Loading-State, Modal, Toast
│   ├── directives/            # auto-animate für List-Animationen
│   ├── components/            # Dashboard, Admin, Login, Profile, …
│   └── widgets/               # Chat, Timetable, Todo, Weather
├── environments/              # environment.ts / environment.production.ts
└── main.ts
```
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

### Production-Build
```bash
npm run build
# Output: dist/familiendashboard
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

Neue Widgets sind schnell hinzugefügt — **ohne den Widget-Container anzupassen**:

### Schritt-für-Schritt:

1. **Neue Widget-Komponente anlegen**
   ```bash
   ng generate component widgets/my-widget-widget --skip-tests
   ```

2. **Input-Properties definieren**
   ```typescript
   @Input() widgetId!: number;
   @Input() canEdit!: boolean;
   ```
   Diese Inputs erhält die Komponente automatisch vom Container.

3. **Widget in der Registry eintragen**
   In `src/app/services/dashboard-service.ts` → `WIDGET_REGISTRY`:
   ```typescript
   'my-widget': MyWidgetComponent,
   ```
   Der Key muss dem `widget_key` aus der Backend-Response entsprechen.

4. **Backend synchronisieren**
   Das Backend muss in der Widget-Response den passenden `widget_key` liefern.

**Tipp:** Bestehende Widgets unter `src/app/widgets/` als Vorlage nutzen (z.B. `todo-widget/`).

---

## Weiterführende Dokumentation

- [Benutzerhandbuch](./docs/user-guide.md) — Anleitung für Endnutzer

---

## Lizenz

Siehe [`LICENSE`](./LICENSE) 
