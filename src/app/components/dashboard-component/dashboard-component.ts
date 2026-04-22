import { ChangeDetectionStrategy, Component, inject, OnInit } from '@angular/core';
import { HeaderComponent } from "../header-component/header-component";
import { WidgetComponent } from "../widget-component/widget-component";
import { DashboardService } from "../../services/dashboard-service";
import { AutoAnimateDirective } from "../../directives/auto-animate-directive";
import { CdkDropList, CdkDropListGroup, CdkDragDrop } from "@angular/cdk/drag-drop";
import { AlertBannerComponent } from "../../shared/alert-banner/alert-banner.component";
import { LoadingStateComponent } from "../../shared/loading-state/loading-state.component";

@Component({
  selector: 'app-dashboard-component',
  imports: [HeaderComponent, WidgetComponent, AutoAnimateDirective, CdkDropList, CdkDropListGroup, AlertBannerComponent, LoadingStateComponent],
  templateUrl: './dashboard-component.html',
  styleUrl: './dashboard-component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DashboardComponent implements OnInit {
  store = inject(DashboardService);

  ngOnInit(): void {
    this.store.loadWidgetsFromBackend();
  }

  drop(event: CdkDragDrop<number, number>) {
    const { previousContainer, container } = event;
    this.store.updateWidgetPosition(previousContainer.data, container.data);
  }
}
