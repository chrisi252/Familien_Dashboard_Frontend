import { Component, OnInit, ChangeDetectorRef, NgZone } from '@angular/core';
const apiKey = ""

@Component({
  selector: 'app-weather-widget',
  imports: [],
  templateUrl: './weather-widget.html',
  styleUrl: './weather-widget.css',
})
export class WeatherWidget implements OnInit {
    WeatherData: any = null; // ← null statt leerem Objekt!

    constructor(
        private cdr: ChangeDetectorRef,
        private ngZone: NgZone
    ) {}

    ngOnInit() {
        this.getWeatherData();
    }

    getWeatherData() {
    
        const city = 'London';
        const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}`;

        fetch(url)
            .then(response => {
                if (!response.ok) throw new Error('Netzwerkantwort war nicht ok');
                return response.json();
            })
            .then(data => {
                // ↓ Änderungen zurück in die Angular-Zone bringen
                this.ngZone.run(() => {
                    this.setWeatherData(data);
                    this.cdr.detectChanges(); // Angular explizit benachrichtigen
                });
            })
            .catch(error => console.error('Error fetching weather data:', error));
    }

    setWeatherData(data: any) {
        this.WeatherData = data;
        const sunsetTime = new Date(this.WeatherData.sys.sunset * 1000);
        this.WeatherData.sunsetTime = sunsetTime.toLocaleTimeString();
        this.WeatherData.sunriseTime = new Date(this.WeatherData.sys.sunrise * 1000).toLocaleTimeString();

        const currentTime = new Date();
        this.WeatherData.isDayTime = currentTime.getTime() < sunsetTime.getTime();

        this.WeatherData.temperatureCelsius = (this.WeatherData.main.temp - 273.15).toFixed(2);
        this.WeatherData.temp_min = (this.WeatherData.main.temp_min - 273.15).toFixed(2);
        this.WeatherData.temp_max = (this.WeatherData.main.temp_max - 273.15).toFixed(2);

        if (this.WeatherData.main.feels_like) {
            this.WeatherData.feels_like = (this.WeatherData.main.feels_like - 273.15).toFixed(2);
        }
    }
}
