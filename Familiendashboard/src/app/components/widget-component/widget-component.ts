import { Component, Input, input, signal } from '@angular/core';
import { Widget } from '../../interfaces/widget';
import { NgComponentOutlet } from '@angular/common';
import { WidgetsOptions } from "./widgets-options/widgets-options";



@Component({
  selector: 'app-widget-component',
    host: {
    'class': 'block w-full h-full',
    '[style.grid-column]': '"span " + (data().cols ?? 1)',
    '[style.grid-row]': '"span " + (data().rows ?? 1)'
  },
  imports: [NgComponentOutlet, WidgetsOptions],
  templateUrl: './widget-component.html',
  styleUrl: './widget-component.css',
})
export class WidgetComponent {
  data = input.required<Widget>();
  showOptions=signal(false);
}
