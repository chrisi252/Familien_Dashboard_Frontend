import { Component, computed, inject, input, signal } from '@angular/core';
import { Widget } from '../../interfaces/widget';
import { NgComponentOutlet } from '@angular/common';
import { WidgetsOptions } from "./widgets-options/widgets-options";
import { NgIcon } from '@ng-icons/core';
import { CdkDrag } from '@angular/cdk/drag-drop';
import { DashboardService } from '../../services/dashboard-service';



@Component({
  selector: 'app-widget-component',
    host: {
    'class': 'block w-full h-full min-w-0 min-h-[14rem] sm:min-h-[16rem]',
    '[style.grid-column]': '"span " + colSpan()',
    '[style.grid-row]': '"span " + (data().rows ?? 1)'
  },
  imports: [NgComponentOutlet, WidgetsOptions,NgIcon, CdkDrag],
  templateUrl: './widget-component.html',
  styleUrl: './widget-component.css',
})
export class WidgetComponent {
  private readonly store = inject(DashboardService);
  data = input.required<Widget>();
  showOptions=signal(false);
  colSpan = computed(() => this.store.isMobile() ? 1 : (this.data().cols ?? 1));
}
