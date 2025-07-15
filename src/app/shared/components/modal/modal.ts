import { Component, inject } from '@angular/core';
import { MaterialModule } from '../../../shared/modules/material-module/material-module';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { DialogConfig } from '../../interfaces/dialog-config.interface';

@Component({
  imports: [MaterialModule],
  templateUrl: './modal.html',
})
export class Modal {
  private readonly dialogRef = inject(MatDialogRef<Modal>);

  public data = inject<DialogConfig>(MAT_DIALOG_DATA);

  accept(): void {
    this.dialogRef.close(true);
  }
}
