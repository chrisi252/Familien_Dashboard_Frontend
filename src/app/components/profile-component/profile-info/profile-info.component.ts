import { Component, input, output } from '@angular/core';
import { User } from '../../../interfaces/user';

@Component({
  selector: 'app-profile-info',
  standalone: true,
  templateUrl: './profile-info.component.html',
})
export class ProfileInfoComponent {
  user = input<User | null>(null);
  isLoading = input<boolean>(false);
  error = input<string>('');

  reload = output<void>();
  goToLogin = output<void>();
  goToDashboard = output<void>();

  formatDate(dateAsString: string): string {
    const date = new Date(dateAsString);
    if (Number.isNaN(date.getTime())) return '-';
    return date.toLocaleDateString('de-DE', { year: 'numeric', month: '2-digit', day: '2-digit' });
  }
}
