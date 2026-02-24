import { Component } from '@angular/core';
import { ThemeSwitchComponent } from "../theme-switch-component/theme-switch-component";
import { Router } from "@angular/router";

@Component({
  selector: 'app-header-component',
  imports: [ThemeSwitchComponent],
  templateUrl: './header-component.html',
  styleUrl: './header-component.css',
})
export class HeaderComponent {
    constructor(private router: Router) {}
logout() {
//hier logout mit apiService
this.router.navigate(['/login']);
}


}
