import { Component, Input, input, signal } from '@angular/core';
import { Widget } from '../../interfaces/widget';
import { NgComponentOutlet } from '@angular/common';
import { WidgetsOptions } from "./widgets-options/widgets-options";
import { NgIcon } from '@ng-icons/core';
import { CdkDrag, CdkDragPlaceholder } from '@angular/cdk/drag-drop';



@Component({
  selector: 'app-widget-component',
    host: {
    'class': 'block w-full h-full',
    '[style.grid-column]': '"span " + (data().cols ?? 1)',
    '[style.grid-row]': '"span " + (data().rows ?? 1)'
  },
  imports: [NgComponentOutlet, WidgetsOptions,NgIcon, CdkDrag,CdkDragPlaceholder],
  templateUrl: './widget-component.html',
  styleUrl: './widget-component.css',
})
export class WidgetComponent {
  data = input.required<Widget>();
  showOptions=signal(false);
}
