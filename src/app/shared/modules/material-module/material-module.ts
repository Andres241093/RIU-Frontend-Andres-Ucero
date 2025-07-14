import { NgModule } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTableModule } from '@angular/material/table';
import { MatToolbarModule } from '@angular/material/toolbar';

const FORM_MATERIAL_MODULES = [MatInputModule];

const SHARED_MATERIAL_MODULES = [
  MatToolbarModule,
  MatButtonModule,
  MatTableModule,
  MatProgressSpinnerModule,
  MatIconModule,
  MatPaginatorModule,
];

@NgModule({
  imports: [...FORM_MATERIAL_MODULES, ...SHARED_MATERIAL_MODULES],
  exports: [...FORM_MATERIAL_MODULES, ...SHARED_MATERIAL_MODULES],
})
export class MaterialModule {}
