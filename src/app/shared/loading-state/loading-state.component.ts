import { Component, input } from '@angular/core';

@Component({
  selector: 'app-loading-state',
  standalone: true,
  host: { style: 'display: contents' },
  templateUrl: './loading-state.component.html',
})
export class LoadingStateComponent {
  loading = input<boolean>(false);
  error = input<string>('');
}
