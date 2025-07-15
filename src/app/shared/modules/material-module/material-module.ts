import { NgModule } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSelectModule } from '@angular/material/select';
import { MatTableModule } from '@angular/material/table';
import { MatToolbarModule } from '@angular/material/toolbar';

const FORM_MATERIAL_MODULES = [
  MatInputModule,
  MatSelectModule,
  MatFormFieldModule,
];

const SHARED_MATERIAL_MODULES = [
  MatToolbarModule,
  MatButtonModule,
  MatTableModule,
  MatProgressSpinnerModule,
  MatIconModule,
  MatPaginatorModule,
  MatProgressBarModule,
  MatDialogModule,
];

@NgModule({
  imports: [...FORM_MATERIAL_MODULES, ...SHARED_MATERIAL_MODULES],
  exports: [...FORM_MATERIAL_MODULES, ...SHARED_MATERIAL_MODULES],
})
export class MaterialModule {}
