import { ChangeDetectionStrategy, ChangeDetectorRef, Component, DestroyRef, inject, OnInit } from '@angular/core';
import { DecimalPipe, SlicePipe, DatePipe } from '@angular/common';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { HttpErrorResponse } from '@angular/common/http';
import { EMPTY, Observable, catchError, map, of, retry, switchMap } from 'rxjs';
import { WeatherService } from '../../services/weather-service';
import { FamilyService } from '../../services/family-service';
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
    private familyService: FamilyService,
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
        this.isDayTime = this.checkDayTime();
        this.error = null;
        this.isLoading = false;
        this.changeDetectorRef.markForCheck();
      });
  }

  retryWeatherLoad() {
    this.loadWeather();
  }

  private resolveFamilyId(): Observable<number> {
    const currentFamilyId = this.userState.currentFamilyId();
    if (currentFamilyId) {
      return of(currentFamilyId);
    }

    return this.familyService.getFamilies().pipe(
      map((res) => {
        const familyId = this.extractFamilyId(res);
        if (!familyId) {
          throw new Error('Keine Familie gefunden');
        }

        const roleName = this.extractRoleName(res);
        this.userState.currentFamilyId.set(familyId);
        this.userState.currentFamilyRole.set(roleName);
        return familyId;
      }),
    );
  }

  private extractFamilyId(response: unknown): number | null {
    const firstMembership = this.extractFirstMembership(response);
    if (!firstMembership) {
      return null;
    }

    const candidate =
      firstMembership['family']?.id ??
      firstMembership['family_id'] ??
      firstMembership['familyId'] ??
      firstMembership['id'];

    if (typeof candidate === 'number' && Number.isFinite(candidate) && candidate > 0) {
      return candidate;
    }

    if (typeof candidate === 'string') {
      const parsed = Number(candidate);
      if (Number.isFinite(parsed) && parsed > 0) {
        return parsed;
      }
    }

    return null;
  }

  private extractRoleName(response: unknown): 'Familyadmin' | 'Guest' | 'SystemAdmin' | null {
    const firstMembership = this.extractFirstMembership(response);
    const roleCandidate = firstMembership?.['role']?.name;

    if (roleCandidate === 'Familyadmin' || roleCandidate === 'Guest' || roleCandidate === 'SystemAdmin') {
      return roleCandidate;
    }

    return null;
  }

  private extractFirstMembership(response: unknown): Record<string, any> | null {
    if (!response || typeof response !== 'object') {
      return null;
    }

    const typedResponse = response as { families?: unknown };

    if (Array.isArray(typedResponse.families) && typedResponse.families.length > 0) {
      const first = typedResponse.families[0];
      if (first && typeof first === 'object') {
        return first as Record<string, any>;
      }
    }

    if (Array.isArray(response) && response.length > 0) {
      const first = response[0];
      if (first && typeof first === 'object') {
        return first as Record<string, any>;
      }
    }

    return null;
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

  private checkDayTime(): boolean {
    const hour = new Date().getHours();
    return hour >= 6 && hour < 20;
  }
}
