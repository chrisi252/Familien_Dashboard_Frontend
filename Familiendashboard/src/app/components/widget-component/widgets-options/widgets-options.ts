import { Component, inject, input, model, output } from '@angular/core';
import { Widget } from '../../../interfaces/widget';
import { DashboardService } from '../../../services/dashboard-service';
import { NgIcon } from '@ng-icons/core';


@Component({
  selector: 'app-widgets-options',
  imports: [NgIcon],
  templateUrl: './widgets-options.html',
  styleUrl: './widgets-options.css',
  host: {
    class: 'absolute top-0 left-0 w-full h-full bg-base-200/95 backdrop-blur-md flex flex-col items-center justify-center text-base-content z-50'
  }
})
export class WidgetsOptions {
showOptions=model<boolean>(false);

store=inject(DashboardService);
  widget = input.required<Widget>();


  closeOptions = output<void>();


  changeWidth(newWidth: number) {
    this.widget().cols = newWidth;
  }

  changeHeight(newHeight: number) {
    this.widget().rows = newHeight;
  }
selectedOption: any;

}
