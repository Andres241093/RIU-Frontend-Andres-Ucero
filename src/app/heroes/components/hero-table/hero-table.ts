import { Component, input } from '@angular/core';
import { MaterialModule } from '../../../shared/modules/material-module/material-module';
import { RouterLink } from '@angular/router';
import { Hero } from '../../interfaces/hero.interface';

@Component({
  imports: [MaterialModule, RouterLink],
  templateUrl: './hero-table.html',
  styleUrl: './hero-table.scss',
})
export class HeroTable {
  dataSource = input.required<Hero[]>();
  public readonly displayedColumns = [
    'id',
    'name',
    'power',
    'universe',
    'options',
  ];
}
