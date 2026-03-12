import { Component, OnInit, signal } from '@angular/core';

interface CalendarEvent {
  id: string;
  title: string;
  date: Date;
}

@Component({
  selector: 'app-calendar-widget',
  imports: [],
  templateUrl: './calendar-widget.html',
  styleUrl: './calendar-widget.css',
})
export class CalendarWidget implements OnInit {
  // Signals für den State
  isAuthenticated = signal<boolean>(false);
  isLoading = signal<boolean>(false);
  events = signal<CalendarEvent[]>([]);

  ngOnInit() {
    // Hier würdest du prüfen, ob der User bereits ein gültiges Google-Token hat
    this.checkInitialAuth();
  }

  checkInitialAuth() {
    // TODO: Google Identity Services (GIS) Initialisierung hier einbauen
  }

  loginWithGoogle() {
    this.isLoading.set(true);
    
    // Simulierter Login & API Call für das UI-Testen (später durch echte Google API ersetzen)
    setTimeout(() => {
      this.isAuthenticated.set(true);
      this.events.set([
        { id: '1', title: 'Team Meeting (Daily)', date: new Date(new Date().setHours(10, 0)) },
        { id: '2', title: 'Projekt-Review mit Kunden', date: new Date(new Date().setHours(14, 30)) },
        { id: '3', title: 'Angular Update besprechen', date: new Date(new Date().setDate(new Date().getDate() + 1)) }
      ]);
      this.isLoading.set(false);
    }, 1500);
  }

  logout() {
    this.isAuthenticated.set(false);
    this.events.set([]);
    // TODO: Google Token widerrufen
  }
}