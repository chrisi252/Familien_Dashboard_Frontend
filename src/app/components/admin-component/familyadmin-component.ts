import { Component } from '@angular/core';
import { HeaderComponent } from '../header-component/header-component';
import { Sidebar } from './sidebar/sidebar';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-familyadmin-component',
  imports: [HeaderComponent,Sidebar,RouterOutlet],
  templateUrl: './familyadmin-component.html',
  styleUrl: './familyadmin-component.css',
})
export class FamilyadminComponent {

}


