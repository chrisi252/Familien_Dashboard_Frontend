import { Component, ViewChild, viewChild } from '@angular/core';
import { Router } from '@angular/router';
import { ThemeSwitchComponent } from "../theme-switch-component/theme-switch-component";

@Component({
  selector: 'app-login-component',
  imports: [ThemeSwitchComponent],
  templateUrl: './login-component.html',
  styleUrl: './login-component.css',
})
export class LoginComponent {
@ViewChild('email') emailInput: any;
@ViewChild ('username') usernameInput: any;
constructor(private router: Router) {}

    login() {
        // hier eig API Service aufrufen um sich anzumelden, aber erstmal nur die Werte aus den Inputs holen
        const email = this.emailInput.nativeElement.value;
        const username = this.usernameInput.nativeElement.value;

            console.log('Email:', email);
            console.log('Username:', username);
      if(email =="test" && username =="test"){
       this.router.navigate(['/dashboard']);
      }

    }
}
