import { Component, Input, input } from '@angular/core';
import { Widget } from '../../interfaces/widget';
import { NgComponentOutlet } from '@angular/common';



@Component({
  selector: 'app-widget-component',
    host: { class: 'block h-full' },
  imports: [ NgComponentOutlet],
  templateUrl: './widget-component.html',
  styleUrl: './widget-component.css',
})
export class WidgetComponent {
  data = input.required<Widget>();
}
