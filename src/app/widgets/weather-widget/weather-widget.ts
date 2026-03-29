import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { DecimalPipe, SlicePipe, DatePipe } from '@angular/common';
import { WeatherService } from '../../services/weather-service';
import { FamilyService } from '../../services/family-service';
import { WeatherResponse } from '../../interfaces/weather';

@Component({
  selector: 'app-weather-widget',
  imports: [DecimalPipe, SlicePipe, DatePipe],
  templateUrl: './weather-widget.html',
  styleUrl: './weather-widget.css',
})
export class WeatherWidget implements OnInit {
  WeatherData: WeatherResponse | null = null;
  isDayTime = true;
  error: string | null = null;
  private retries = 0;

  constructor(
    private weatherService: WeatherService,
    private familyService: FamilyService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.loadWeather();
  }

  loadWeather() {
    this.familyService.getFamilies().subscribe({
      next: (response: any) => {
        const families = Array.isArray(response) ? response : response?.families ?? [];
        if (!families || families.length === 0) {
          this.error = 'Keine Familie vorhanden – bitte erstelle oder tritt einer Familie bei';
          this.cdr.detectChanges();
          return;
        }
        const familyId = families[0].family?.id ?? families[0].id;
        this.fetchWeather(familyId);
      },
      error: (err) => {
        if (this.retries < 2) {
          this.retries++;
          setTimeout(() => this.loadWeather(), 1500);
        } else {
          console.error('Error fetching families:', err);
          this.error = 'Familiendaten konnten nicht geladen werden';
          this.cdr.detectChanges();
        }
      },
    });
  }

  private fetchWeather(familyId: number) {
    this.weatherService.getWeather(familyId).subscribe({
      next: (data) => {
        this.WeatherData = data;
        this.isDayTime = this.checkDayTime();
        this.cdr.detectChanges();
      },
      error: (err) => {
        // Kein Ort konfiguriert → Standardstadt setzen und nochmal versuchen
        if (err.status === 400 || err.status === 500) {
          this.weatherService.updateLocation(familyId, 'Wien').subscribe({
            next: () => {
              this.weatherService.getWeather(familyId).subscribe({
                next: (data) => {
                  this.WeatherData = data;
                  this.isDayTime = this.checkDayTime();
                },
                error: (retryErr) => {
                  console.error('Error fetching weather after setting default city:', retryErr);
                  this.error = 'Wetterdaten konnten nicht geladen werden';
          this.cdr.detectChanges();
                },
              });
            },
            error: (locErr) => {
              console.error('Error setting default location:', locErr);
              this.error = 'Standardort konnte nicht gesetzt werden';
              this.cdr.detectChanges();
            },
          });
        } else {
          console.error('Error fetching weather data:', err);
          this.error = 'Wetterdaten konnten nicht geladen werden';
          this.cdr.detectChanges();
        }
      },
    });
  }

  private checkDayTime(): boolean {
    const hour = new Date().getHours();
    return hour >= 6 && hour < 20;
  }
}
