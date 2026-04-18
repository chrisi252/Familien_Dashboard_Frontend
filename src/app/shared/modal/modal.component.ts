import { Component, inject, OnDestroy, OnInit, output } from '@angular/core';
import { ModalStateService } from './modal-state.service';

@Component({
  selector: 'app-modal',
  standalone: true,
  templateUrl: './modal.component.html',
})
export class ModalComponent implements OnInit, OnDestroy {
  private modalState = inject(ModalStateService);

  backdropClicked = output<void>();

  ngOnInit(): void {
    this.modalState.register();
  }

  ngOnDestroy(): void {
    this.modalState.unregister();
  }
}
