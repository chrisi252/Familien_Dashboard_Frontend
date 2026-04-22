import { ChangeDetectionStrategy, ChangeDetectorRef, Component, DestroyRef, inject, input, OnInit } from '@angular/core';
import { DecimalPipe, SlicePipe, DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { HttpErrorResponse } from '@angular/common/http';
import { EMPTY, Observable, catchError, retry, switchMap } from 'rxjs';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { heroPencil, heroCheck, heroXMark } from '@ng-icons/heroicons/outline';
import { WeatherService } from '../../services/weather-service';
import { WeatherResponse } from '../../interfaces/weather';
import { UserStateService } from '../../services/user-state-service';

@Component({
  selector: 'app-weather-widget',
  imports: [DecimalPipe, SlicePipe, DatePipe, NgIcon, FormsModule],
  viewProviders: [provideIcons({ heroPencil, heroCheck, heroXMark })],
  templateUrl: './weather-widget.html',
  styleUrl: './weather-widget.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WeatherWidget implements OnInit {
  widgetId = input<number>(0);
  canEdit = input<boolean>(false);

  weatherData: WeatherResponse | null = null;
  isDayTime = true;
  error: string | null = null;
  isLoading = true;

  isEditing = false;
  editCity = '';
  isSaving = false;
  saveError: string | null = null;

  private resolvedFamilyId: number | null = null;

  private readonly destroyRef = inject(DestroyRef);
  private readonly userState = inject(UserStateService);
  private readonly weatherService = inject(WeatherService);
  private readonly changeDetectorRef = inject(ChangeDetectorRef);

  ngOnInit() {
    this.loadWeather();
  }

  loadWeather() {
    this.isLoading = true;
    this.error = null;

    this.resolveFamilyId()
      .pipe(
        switchMap((familyId) => {
          this.resolvedFamilyId = familyId;
          return this.weatherService.getWeather(familyId);
        }),
        retry(1),
        catchError((error: HttpErrorResponse | Error) => {
          this.weatherData = null;
          this.error = this.mapLoadError(error);
          this.isLoading = false;
          this.changeDetectorRef.markForCheck();
          return EMPTY;
        }),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe((data) => {
        this.weatherData = data;
        this.isDayTime = this.checkDayTime(data.current.icon);
        this.error = null;
        this.isLoading = false;
        this.changeDetectorRef.markForCheck();
      });
  }

  retryWeatherLoad() {
    this.loadWeather();
  }

  openCityEdit() {
    this.editCity = this.weatherData?.location?.city_name ?? '';
    this.saveError = null;
    this.isEditing = true;
    this.changeDetectorRef.markForCheck();
  }

  cancelCityEdit() {
    this.isEditing = false;
    this.saveError = null;
    this.changeDetectorRef.markForCheck();
  }

  saveCityEdit() {
    const city = this.editCity.trim();
    if (!city) {
      this.saveError = 'Bitte einen gültigen Ort eingeben.';
      this.changeDetectorRef.markForCheck();
      return;
    }
    if (!this.resolvedFamilyId) {
      this.saveError = 'Keine aktive Familie gefunden.';
      this.changeDetectorRef.markForCheck();
      return;
    }
    this.isSaving = true;
    this.saveError = null;
    this.changeDetectorRef.markForCheck();

    this.weatherService
      .updateLocation(this.resolvedFamilyId, city)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: () => {
          this.isSaving = false;
          this.isEditing = false;
          this.changeDetectorRef.markForCheck();
          this.loadWeather();
        },
        error: (error: HttpErrorResponse) => {
          this.isSaving = false;
          this.saveError = this.mapSaveError(error);
          this.changeDetectorRef.markForCheck();
        },
      });
  }

  private mapSaveError(error: HttpErrorResponse): string {
    if (error.status === 0) return 'Verbindungsfehler.';
    if (error.status === 403) return 'Keine Berechtigung zum Bearbeiten.';
    if (error.status === 404) return 'Standortdaten nicht gefunden.';
    if (error.status >= 500) return 'Serverfehler beim Speichern.';
    return 'Standort konnte nicht gespeichert werden.';
  }

  private resolveFamilyId(): Observable<number> {
    return this.userState.resolveCurrentFamilyId$();
  }

  private mapLoadError(error: HttpErrorResponse | Error): string {
    if (error instanceof HttpErrorResponse) {
      if (error.status === 0) {
        return 'Verbindungsfehler. Wetterdaten konnten nicht geladen werden.';
      }
      if (error.status === 404) {
        return 'Fuer diese Familie sind keine Wetterdaten vorhanden.';
      }
      if (error.status >= 500) {
        return 'Serverfehler beim Laden der Wetterdaten.';
      }
      return 'Wetterdaten konnten nicht geladen werden.';
    }

    return error.message || 'Wetterdaten konnten nicht geladen werden.';
  }

  private checkDayTime(icon: string): boolean {
    return icon.includes('d');
  }
}
