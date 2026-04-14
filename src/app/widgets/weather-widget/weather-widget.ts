import { ChangeDetectionStrategy, ChangeDetectorRef, Component, DestroyRef, inject, OnInit } from '@angular/core';
import { DecimalPipe, SlicePipe, DatePipe } from '@angular/common';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { HttpErrorResponse } from '@angular/common/http';
import { EMPTY, Observable, catchError, retry, switchMap } from 'rxjs';
import { WeatherService } from '../../services/weather-service';
import { WeatherResponse } from '../../interfaces/weather';
import { UserStateService } from '../../services/user-state-service';

@Component({
  selector: 'app-weather-widget',
  imports: [DecimalPipe, SlicePipe, DatePipe],
  templateUrl: './weather-widget.html',
  styleUrl: './weather-widget.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WeatherWidget implements OnInit {
  weatherData: WeatherResponse | null = null;
  isDayTime = true;
  error: string | null = null;
  isLoading = true;

  private resolvedFamilyId: number | null = null;

  private readonly destroyRef = inject(DestroyRef);
  private readonly userState = inject(UserStateService);

  constructor(
    private weatherService: WeatherService,
    private changeDetectorRef: ChangeDetectorRef,
  ) {}

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
    // Example logic - replace with actual day/night detection based on icon
    return icon.includes('d');
  }
}
