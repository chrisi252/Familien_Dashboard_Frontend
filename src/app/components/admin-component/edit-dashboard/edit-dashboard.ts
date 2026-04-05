import { Component, DestroyRef, inject, signal } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { switchMap } from 'rxjs';
import { UserStateService } from '../../../services/user-state-service';
import { WeatherService } from '../../../services/weather-service';

@Component({
  selector: 'app-edit-dashboard',
  imports: [],
  templateUrl: './edit-dashboard.html',
  styleUrl: './edit-dashboard.css',
})
export class EditDashboard {
  private readonly weatherService = inject(WeatherService);
  private readonly userState = inject(UserStateService);
  private readonly destroyRef = inject(DestroyRef);

  city = signal('');
  isLoading = signal(true);
  isSaving = signal(false);
  error = signal<string | null>(null);
  success = signal<string | null>(null);

  private familyId: number | null = null;

  ngOnInit() {
    this.loadCurrentLocation();
  }

  onCityInput(event: Event) {
    const input = event.target as HTMLInputElement | null;
    this.city.set(input?.value ?? '');
  }

  saveLocation() {
    if (!this.familyId) {
      this.error.set('Keine aktive Familie ausgewaehlt.');
      return;
    }

    const city = this.city().trim();
    if (!city) {
      this.error.set('Bitte einen gueltigen Ort eingeben.');
      return;
    }

    this.error.set(null);
    this.success.set(null);
    this.isSaving.set(true);

    this.weatherService
      .updateLocation(this.familyId, city)
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        switchMap(() => this.weatherService.getLocation(this.familyId!)),
      )
      .subscribe({
        next: (res) => {
          this.city.set(res.location.city_name ?? city);
          this.success.set('Standort erfolgreich aktualisiert.');
          this.isSaving.set(false);
        },
        error: (error: HttpErrorResponse) => {
          this.error.set(this.mapError(error));
          this.isSaving.set(false);
        },
      });
  }

  private loadCurrentLocation() {
    this.isLoading.set(true);
    this.error.set(null);
    this.success.set(null);

    this.resolveFamilyId()
      .pipe(
        switchMap((familyId) => {
          this.familyId = familyId;
          return this.weatherService.getLocation(familyId);
        }),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe({
        next: (res) => {
          this.city.set(res.location.city_name ?? '');
          this.isLoading.set(false);
        },
        error: (error: HttpErrorResponse | Error) => {
          this.error.set(this.mapUnknownError(error));
          this.isLoading.set(false);
        },
      });
  }

  private resolveFamilyId() {
    return this.userState.resolveCurrentFamilyId$();
  }

  private mapUnknownError(error: HttpErrorResponse | Error): string {
    if (error instanceof HttpErrorResponse) {
      return this.mapError(error);
    }
    return error.message || 'Standort konnte nicht geladen werden.';
  }

  private mapError(error: HttpErrorResponse): string {
    if (error.status === 0) {
      return 'Verbindungsfehler. Bitte spaeter erneut versuchen.';
    }
    if (error.status === 403) {
      return 'Nur Familienadmins duerfen den Standort bearbeiten.';
    }
    if (error.status === 404) {
      return 'Standortdaten fuer diese Familie wurden nicht gefunden.';
    }
    if (error.status >= 500) {
      return 'Serverfehler beim Speichern oder Laden des Standorts.';
    }
    return 'Standort konnte nicht verarbeitet werden.';
  }

}
