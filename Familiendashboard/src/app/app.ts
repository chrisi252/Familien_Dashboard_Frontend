import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ThemeSwitchComponent } from "./components/theme-switch-component/theme-switch-component";


@Component({
  selector: 'app-root',
  imports: [RouterOutlet, ThemeSwitchComponent],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('Familiendashboard');

}
