import { Component, input } from '@angular/core';

@Component({
  selector: 'app-alert-banner',
  standalone: true,
  templateUrl: './alert-banner.component.html',
})
export class AlertBannerComponent {
  message = input<string>('');
  type = input<'error' | 'success'>('error');
}
