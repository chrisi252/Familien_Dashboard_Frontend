import { ChangeDetectionStrategy, Component, computed, inject, input, signal } from '@angular/core';
import { Widget } from '../../interfaces/widget';
import { NgComponentOutlet } from '@angular/common';
import { WidgetsOptions } from "./widgets-options/widgets-options";
import { NgIcon } from '@ng-icons/core';
import { CdkDrag } from '@angular/cdk/drag-drop';
import { DashboardService } from '../../services/dashboard-service';
import { ModalStateService } from '../../shared/modal/modal-state.service';



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
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WidgetComponent {
  protected readonly store = inject(DashboardService);
  protected readonly modalState = inject(ModalStateService);
  data = input.required<Widget>();
  showOptions = signal(false);
  // Widget darf nie mehr Spalten beanspruchen, als das aktuelle Grid hergibt
  // (sonst Overflow/Layout-Sprünge auf engen Viewports).
  colSpan = computed(() => {
    const requested = this.data().cols ?? 1;
    const maxCols = this.store.gridCols();
    return Math.min(Math.max(1, requested), Math.max(1, maxCols));
  });
  
  widgetInputs = computed(() => ({
    widgetId: this.data().id,
    canEdit: this.data().permissions.write
  }));
}
