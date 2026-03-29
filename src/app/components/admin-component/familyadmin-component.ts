import { Component, signal } from '@angular/core';
import { User } from '../../interfaces/user';
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


