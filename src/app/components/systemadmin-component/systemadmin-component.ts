import { Component } from '@angular/core';
import { HeaderComponent } from '../header-component/header-component';
import { SystemadminSidebar } from './sidebar/sidebar';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-systemadmin-component',
  imports: [HeaderComponent, SystemadminSidebar, RouterOutlet],
  templateUrl: './systemadmin-component.html',
  styleUrl: './systemadmin-component.css',
})
export class SystemadminComponent {}
