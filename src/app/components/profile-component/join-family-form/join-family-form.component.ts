import { Component, input, output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AlertBannerComponent } from '../../../shared/alert-banner/alert-banner.component';

@Component({
  selector: 'app-join-family-form',
  standalone: true,
  imports: [FormsModule, AlertBannerComponent],
  templateUrl: './join-family-form.component.html',
})
export class JoinFamilyFormComponent {
  loading = input<boolean>(false);
  error = input<string>('');
  success = input<boolean>(false);

  codeSubmitted = output<string>();

  code = '';

  submit() {
    this.codeSubmitted.emit(this.code);
  }
}
