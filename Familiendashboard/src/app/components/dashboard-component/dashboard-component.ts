import { Component, inject } from '@angular/core';
import { HeaderComponent } from "../header-component/header-component";
import { WidgetComponent } from "../widget-component/widget-component";
import { DashboardService } from "../../services/dashboard-service";
import { AutoAnimateDirective } from "../../directives/auto-animate-directive";
import { CdkDropList, CdkDropListGroup, CdkDragDrop } from "@angular/cdk/drag-drop";

@Component({
  selector: 'app-dashboard-component',
  imports: [HeaderComponent, WidgetComponent, AutoAnimateDirective, CdkDropList, CdkDropListGroup],
  templateUrl: './dashboard-component.html',
  styleUrl: './dashboard-component.css',
  providers: [DashboardService],

})
export class DashboardComponent {

store = inject(DashboardService);

drop(event: CdkDragDrop<number, number>) {
  const { previousContainer, container } = event;
  this.store.updateWidgetPosition(previousContainer.data,container.data);
 
}

}
