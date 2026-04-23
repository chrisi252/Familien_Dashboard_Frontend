import { ChangeDetectionStrategy, Component, computed, DestroyRef, inject, input, OnInit, signal } from '@angular/core';
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
import { ThemeService } from '../../services/theme-service';

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

  weatherData = signal<WeatherResponse | null>(null);
  isDayTime = signal(true);
  error = signal<string | null>(null);
  isLoading = signal(true);
  selectedForecastIndex = signal(0);

  selectedForecast = computed(() => {
    const forecast = this.weatherData()?.forecast;
    if (!forecast?.length) return null;
    return forecast[this.selectedForecastIndex()] ?? null;
  });

  isEditing = signal(false);
  editCity = signal('');
  isSaving = signal(false);
  saveError = signal<string | null>(null);

  private resolvedFamilyId: number | null = null;

  private readonly destroyRef = inject(DestroyRef);
  private readonly userState = inject(UserStateService);
  private readonly weatherService = inject(WeatherService);
  private readonly themeService = inject(ThemeService);

  isLightBackground = computed(() => this.isDayTime() && !this.themeService.isDarkMode());

  ngOnInit() {
    this.loadWeather();
  }

  loadWeather() {
    this.isLoading.set(true);
    this.error.set(null);

    this.resolveFamilyId()
      .pipe(
        switchMap((familyId) => {
          this.resolvedFamilyId = familyId;
          return this.weatherService.getWeather(familyId);
        }),
        retry(1),
        catchError((err: HttpErrorResponse | Error) => {
          this.weatherData.set(null);
          this.error.set(this.mapLoadError(err));
          this.isLoading.set(false);
          return EMPTY;
        }),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe((data) => {
        this.weatherData.set(data);
        this.isDayTime.set(this.checkDayTime(data.current.icon));
        this.selectedForecastIndex.set(0);
        this.error.set(null);
        this.isLoading.set(false);
      });
  }

  retryWeatherLoad() {
    this.loadWeather();
  }

  openCityEdit() {
    this.editCity.set(this.weatherData()?.location?.city_name ?? '');
    this.saveError.set(null);
    this.isEditing.set(true);
  }

  cancelCityEdit() {
    this.isEditing.set(false);
    this.saveError.set(null);
  }

  saveCityEdit() {
    const city = this.editCity().trim();
    if (!city) {
      this.saveError.set('Bitte einen gültigen Ort eingeben.');
      return;
    }
    if (!this.resolvedFamilyId) {
      this.saveError.set('Keine aktive Familie gefunden.');
      return;
    }
    this.isSaving.set(true);
    this.saveError.set(null);

    this.weatherService
      .updateLocation(this.resolvedFamilyId, city)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: () => {
          this.isSaving.set(false);
          this.isEditing.set(false);
          this.loadWeather();
        },
        error: (err: HttpErrorResponse) => {
          this.isSaving.set(false);
          this.saveError.set(this.mapSaveError(err));
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

  nextForecast() {
    const max = (this.weatherData()?.forecast?.length ?? 1) - 1;
    if (this.selectedForecastIndex() < max) this.selectedForecastIndex.update(i => i + 1);
  }

  prevForecast() {
    if (this.selectedForecastIndex() > 0) this.selectedForecastIndex.update(i => i - 1);
  }

  private checkDayTime(icon: string): boolean {
    return icon.includes('d');
  }
}
