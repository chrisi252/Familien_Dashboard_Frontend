# Familiendashboard Frontend

Web-Oberfläche für ein familienbasiertes Dashboard mit rollenbasierter Navigation, dynamischen Widgets und getrennten Admin-Bereichen. Das Frontend ist als Angular-SPA umgesetzt und erwartet ein erreichbares Backend für Authentifizierung, Familienverwaltung, Widgets und Chat.

## Überblick

- Angular 21 mit Standalone Components, Router und Functional Guards
- TypeScript 5.9
- Tailwind CSS 4 und DaisyUI 5
- Angular CDK für Drag & Drop und Layout-Interaktion
- Socket.IO Client für Live-Kommunikation
- Runtime-Konfiguration über `public/env.js` und `window.__env.API_URL`

## Funktionen

- Login und Registrierung
- Familienauswahl sowie Familie beitreten oder neu anlegen
- Dashboard mit verschiebbaren Widgets
- Widgets für Stundenplan, Wetter, To-Dos und Chat
- Profilseite für angemeldete Nutzer
- Familien-Admin-Bereich für Benutzer und Widgets
- System-Admin-Bereich für systemweite Verwaltung

## Wichtige Routen

- `/login`
- `/register`
- `/family-selection`
- `/family-selection/join`
- `/family-selection/create`
- `/dashboard`
- `/profile`
- `/widgets`
- `/familyadmin`
- `/familyadmin/editusers`
- `/familyadmin/editwidgets`
- `/familyadmin/dashboard`
- `/systemadmin`
- `/systemadmin/users`
- `/systemadmin/families`
- `/systemadmin/accounts`

Nicht gefundene Seiten werden über `/not-found` bzw. die Wildcard-Route abgefangen.

## Projektstruktur

```
src/
├── app/
│   ├── components/   # Login, Dashboard, Admin, Profile, Selection, Not Found
│   ├── widgets/      # Weather, Todo, Timetable, Chat
│   ├── services/     # API- und Zustandsservices
│   ├── guards/       # Auth-, FamilyAdmin-, SystemAdmin-, Has-Family-Guards
│   ├── shared/       # Banner, Loading, Modal, Toast
│   ├── directives/   # Auto-animate directive
│   ├── interfaces/   # DTOs und View-Model-Typen
│   └── core/         # API-Konfiguration und HTTP-Basis
├── environments/      # environment.ts / environment.production.ts
└── main.ts
```

## Voraussetzungen

- Node.js 24.x
- npm 11.x
- ein erreichbares Backend für die API und Socket.IO-Endpunkte

## Lokal starten

Die Dev-Umgebung liest das Proxy-Ziel aus `BACKEND_URL`. Optional kann dafür eine lokale `.env`-Datei verwendet werden, die auf der Vorlage [`.env.example`](./.env.example) basiert.

```bash
npm ci
npm start
```

Danach läuft die App standardmäßig unter `http://localhost:4200`.

### Verfügbare Scripts

- `npm start` - Angular Dev-Server
- `npm run build` - Production-Build
- `npm run watch` - Build im Watch-Modus
- `npm test` - Unit-Tests

## API- und Runtime-Konfiguration

- Der Angular-Dev-Server proxyt `/api` und `/socket.io` an `BACKEND_URL` aus der lokalen Umgebung oder `.env`-Datei.
- Für Builds und Container-Deployments liest die App zur Laufzeit `window.__env.API_URL` aus `public/env.js`.
- Wenn keine Runtime-URL gesetzt ist, wird in der App `/api` als Fallback verwendet.

## Docker

### Development mit Docker Compose

```bash
docker compose up
```

Das startet den Dev-Container auf Port `4200`.

### Production mit Docker Compose

```bash
docker compose --profile prod up angular-prod
```

Die gebaute SPA wird dabei über Nginx auf Port `8080` ausgeliefert.

### Direkter Build

```bash
docker build --target production -t familiendashboard-frontend .
docker run --rm -p 8080:80 familiendashboard-frontend
```

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
   ng generate component widgets/my-widget-widget 
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


---

## Weiterführende Dokumentation

- [Benutzerhandbuch](./docs/user-guide.md)

## Lizenz

Siehe [LICENSE](./LICENSE)
