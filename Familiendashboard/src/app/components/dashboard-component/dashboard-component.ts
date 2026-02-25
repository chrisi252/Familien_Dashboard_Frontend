import { Component, inject } from '@angular/core';
import { HeaderComponent } from "../header-component/header-component";
import { WidgetComponent } from "../widget-component/widget-component";
import { DashboardService } from "../../services/dashboard-service";


@Component({
  selector: 'app-dashboard-component',
  imports: [HeaderComponent, WidgetComponent],
  templateUrl: './dashboard-component.html',
  styleUrl: './dashboard-component.css',
  providers: [DashboardService],

})
export class DashboardComponent {

store=inject(DashboardService);

}
