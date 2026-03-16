import { Component, OnInit } from '@angular/core';


@Component({
  selector: 'app-weather-widget',
  imports: [],
  templateUrl: './weather-widget.html',
  styleUrl: './weather-widget.css',
})
export class WeatherWidget implements OnInit {
    WeatherData: any;

    ngOnInit() {
        this.WeatherData={
            main:{},
            isDayTime: true
        };
        this.getWeatherData();
    }

    getWeatherData() {

       fetch('https://api.openweathermap.org/data/2.5/weather?q=London&appid=de1c8b9e5c0a7f1d9e4b8c8e5f6a7b')
        .then(response => response.json())
        .then(data => this.setWeatherData(data))
        .catch(error => console.error('Error fetching weather data:', error));
        let data =JSON.parse('{"coord":{"lon":-0.13,"lat":51.51},"weather":[{"id":300,"main":"Drizzle","description":"light intensity drizzle","icon":"09d"}],"base":"stations","main":{"temp":280.32,"pressure":1012,"humidity":81,"temp_min":279.15,"temp_max":281.15},"visibility":10000,"wind":{"speed":4.1,"deg":80},"clouds":{"all":90},"dt":1485789600,"sys":{"type":1,"id":5091,"message":0.0103,"country":"GB","sunrise":1485762037,"sunset":1485794875},"id":2643743,"name":"London","cod":200}')
        this.setWeatherData(data);
    }
    setWeatherData(data: any) {
        this.WeatherData = data;
        let sunsetTime = new Date(this.WeatherData.sys.sunset * 1000);
        this.WeatherData.sunsetTime = sunsetTime.toLocaleTimeString();
        let currentTime = new Date();
        this.WeatherData.isDayTime = currentTime.getTime() < sunsetTime.getTime();
        this.WeatherData.temperatureCelsius = (this.WeatherData.main.temp - 273.15).toFixed(2);
        this.WeatherData.temp_min = (this.WeatherData.main.temp_min - 273.15).toFixed(2);
        this.WeatherData.temp_max = (this.WeatherData.main.temp_max - 273.15).toFixed(2);
        this.WeatherData.feels_like = (this.WeatherData.main.feels_like - 273.15).toFixed(2);
        this.WeatherData.isDayTime = true;
    }
}
/*
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-weather-widget',
  imports: [],
  templateUrl: './weather-widget.html',
  styleUrl: './weather-widget.css',
})
export class WeatherWidget implements OnInit {
    WeatherData: any;

    ngOnInit() {
        this.WeatherData = {
            main: {},
            isDayTime: true
        };
        this.getWeatherData();
    }

    getWeatherData() {
        // Hier deinen echten API-Key eintragen!
        const apiKey = 'import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-weather-widget',
  imports: [],
  templateUrl: './weather-widget.html',
  styleUrl: './weather-widget.css',
})
export class WeatherWidget implements OnInit {
    WeatherData: any;

    ngOnInit() {
        this.WeatherData = {
            main: {},
            isDayTime: true
        };
        this.getWeatherData();
    }

    getWeatherData() {

        const apiKey = 'DEIN_ECHTER_API_KEY_HIER';
        const city = 'London';
        const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}`;

        fetch(url)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Netzwerkantwort war nicht ok');
                }
                return response.json();
            })
            .then(data => this.setWeatherData(data))
            .catch(error => console.error('Error fetching weather data:', error));

    }

    setWeatherData(data: any) {
        this.WeatherData = data;
        let sunsetTime = new Date(this.WeatherData.sys.sunset * 1000);
        this.WeatherData.sunsetTime = sunsetTime.toLocaleTimeString();

        let currentTime = new Date();

        this.WeatherData.isDayTime = currentTime.getTime() < sunsetTime.getTime();


        this.WeatherData.temperatureCelsius = (this.WeatherData.main.temp - 273.15).toFixed(2);
        this.WeatherData.temp_min = (this.WeatherData.main.temp_min - 273.15).toFixed(2);
        this.WeatherData.temp_max = (this.WeatherData.main.temp_max - 273.15).toFixed(2);

        if (this.WeatherData.main.feels_like) {
            this.WeatherData.feels_like = (this.WeatherData.main.feels_like - 273.15).toFixed(2);
        }


    }
}';
        const city = 'London';
        const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}`;

        fetch(url)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Netzwerkantwort war nicht ok');
                }
                return response.json();
            })
            .then(data => this.setWeatherData(data))
            .catch(error => console.error('Error fetching weather data:', error));


    }

    setWeatherData(data: any) {
        this.WeatherData = data;
        let sunsetTime = new Date(this.WeatherData.sys.sunset * 1000);
        this.WeatherData.sunsetTime = sunsetTime.toLocaleTimeString();

        let currentTime = new Date();
        // Dynamische Tag/Nacht-Berechnung
        this.WeatherData.isDayTime = currentTime.getTime() < sunsetTime.getTime();


        this.WeatherData.temperatureCelsius = (this.WeatherData.main.temp - 273.15).toFixed(2);
        this.WeatherData.temp_min = (this.WeatherData.main.temp_min - 273.15).toFixed(2);
        this.WeatherData.temp_max = (this.WeatherData.main.temp_max - 273.15).toFixed(2);

        if (this.WeatherData.main.feels_like) {
            this.WeatherData.feels_like = (this.WeatherData.main.feels_like - 273.15).toFixed(2);
        }


    }
}
*/