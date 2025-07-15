import { inject, Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Modal } from '../../shared/components/modal/modal';
import { DialogConfig } from '../../shared/interfaces/dialog-config.interface';

@Injectable({
  providedIn: 'root',
})
export class ModalService {
  private matDialog = inject(MatDialog);

  /**
   * Opens a modal dialog with the specified component.
   *
   * @param dialogConfig All necessary data to render the modal
   * @param callback Optional callback function to be executed after the modal is closed.
   */
  open(dialogConfig: DialogConfig, callback?: () => void): void {
    this.matDialog
      .open(Modal, {
        disableClose: true,
        data: {
          ...dialogConfig,
        },
      })
      .afterClosed()
      .subscribe({
        next: (result) => {
          if (result && callback) callback();
        },
      });
  }
}
